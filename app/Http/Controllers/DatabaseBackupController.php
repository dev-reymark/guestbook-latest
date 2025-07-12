<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DatabaseBackupController extends Controller
{
    public function index()
    {
        try {
            // List existing backups
            $backupFiles = collect(Storage::disk('local')->files('db-backups'))
                ->map(function ($file) {
                    return [
                        'name' => basename($file),
                        'size' => Storage::disk('local')->size($file),
                        'date' => Storage::disk('local')->lastModified($file),
                    ];
                })
                ->sortByDesc('date')
                ->values()
                ->toArray();

            Log::info('Viewed database backups list', [
                'count' => count($backupFiles),
                'user_id' => auth()->id()
            ]);

            return Inertia::render('Admin/DB/Backup', [
                'backups' => $backupFiles,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to view backups list', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return redirect()->back()->with('error', 'Failed to load backups list.');
        }
    }

    public function store(Request $request)
    {
        $filename = "backup-" . now()->format('Y-m-d_H-i-s') . ".sql";
        $path = storage_path('app/db-backups/' . $filename);

        try {
            Storage::disk('local')->makeDirectory('db-backups');
            Log::debug('Backup directory verified/created', ['path' => $path]);

            // Step 1: Try to locate mysqldump
            exec(PHP_OS_FAMILY === 'Windows' ? 'where mysqldump' : 'which mysqldump', $output, $returnVar);

            if ($returnVar !== 0 || empty($output)) {
                Log::error('mysqldump not found on system PATH');
                return redirect()->back()->with('error', 'mysqldump not found. Please install MySQL or check your system PATH.');
            }

            $mysqldumpPath = $output[0]; // Use the first match

            // Step 2: Run the mysqldump command
            $command = "\"$mysqldumpPath\" -u " . env('DB_USERNAME') .
                " --password=" . escapeshellarg(env('DB_PASSWORD')) . " " .
                env('DB_DATABASE') . " > " . escapeshellarg($path) . " 2>&1";

            Log::info('Starting database backup', [
                'command' => str_replace(env('DB_PASSWORD'), '*****', $command), // Mask password if any
                'user_id' => auth()->id()
            ]);

            $startTime = microtime(true);
            $returnVar = null;
            $output = null;

            exec($command, $output, $returnVar);
            $duration = round(microtime(true) - $startTime, 2);

            if ($returnVar === 0) {
                $size = filesize($path) ? round(filesize($path) / 1024, 2) . ' KB' : '0 KB';

                Log::info('Database backup completed successfully', [
                    'filename' => $filename,
                    'size' => $size,
                    'duration_seconds' => $duration,
                    'user_id' => auth()->id()
                ]);

                return redirect()->back()->with('success', 'Database backup created successfully.');
            } else {
                Log::error('Database backup command failed', [
                    'return_var' => $returnVar,
                    'output' => $output,
                    'command' => $command,
                    'duration_seconds' => $duration,
                    'user_id' => auth()->id()
                ]);

                return redirect()->back()->with('error', 'Database backup failed.');
            }
        } catch (\Exception $e) {
            Log::error('Database backup process failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'filename' => $filename,
                'user_id' => auth()->id()
            ]);

            return redirect()->back()->with('error', 'Database backup process failed.');
        }
    }

    public function download($filename)
    {
        try {
            // Validate the filename to prevent directory traversal
            if (!Storage::disk('local')->exists('db-backups/' . $filename)) {
                Log::warning('Attempted to download non-existent backup', [
                    'filename' => $filename,
                    'user_id' => auth()->id()
                ]);
                abort(404);
            }

            Log::info('Backup file downloaded', [
                'filename' => $filename,
                'user_id' => auth()->id()
            ]);

            return response()->download(storage_path('app/db-backups/' . $filename));
        } catch (\Exception $e) {
            Log::error('Failed to download backup file', [
                'filename' => $filename,
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return redirect()->back()->with('error', 'Failed to download backup file.');
        }
    }

    public function destroy($filename)
    {
        try {
            // Validate the filename
            if (!Storage::disk('local')->exists('db-backups/' . $filename)) {
                Log::warning('Attempted to delete non-existent backup', [
                    'filename' => $filename,
                    'user_id' => auth()->id()
                ]);
                abort(404);
            }

            $fileSize = Storage::disk('local')->size('db-backups/' . $filename);
            Storage::disk('local')->delete('db-backups/' . $filename);

            Log::info('Backup file deleted', [
                'filename' => $filename,
                'size' => $fileSize,
                'user_id' => auth()->id()
            ]);

            return redirect()->back()->with('success', 'Backup deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete backup file', [
                'filename' => $filename,
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return redirect()->back()->with('error', 'Failed to delete backup file.');
        }
    }
}
