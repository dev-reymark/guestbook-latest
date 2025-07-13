<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exports\GuestExport;
use App\Exports\GuestPdfExport;
use App\Imports\GuestsImport;
use App\Models\Guest;
use App\Models\GuestItem;
use App\Models\GuestLog;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class ReportController extends Controller
{
    public function create()
    {
        return inertia('Admin/Report/GuestReport');
    }

    public function export(Request $request)
    {
        // Log the incoming request data
        logger()->info('Export request received', [
            'all_request_data' => $request->all(),
            'format' => $request->format,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        try {
            $format = $request->format ?? 'xlsx'; // Default to xlsx if not specified
            $startDate = $request->start_date;
            $endDate = $request->end_date;

            // Validate the format
            if (!in_array($format, ['pdf', 'csv', 'xlsx'])) {
                throw new \InvalidArgumentException("Invalid export format: {$format}");
            }

            // Log before processing
            logger()->debug('Starting export process', [
                'format' => $format,
                'date_range' => $startDate && $endDate
                    ? "{$startDate} to {$endDate}"
                    : 'No date filter'
            ]);

            $result = null;

            if ($format === 'pdf') {
                logger()->debug('Attempting PDF export (real PDF via DomPDF)');

                $pdfExport = new GuestPdfExport($startDate, $endDate);

                $viewData = $pdfExport->view()->getData();

                $pdf = PDF::loadView('exports.guests', $viewData)
                    ->setPaper('A4', 'landscape');

                logger()->debug('PDF generated via DomPDF');
                return $pdf->download('guests-report.pdf');
            } elseif ($format === 'csv') {
                logger()->debug('Attempting CSV export');
                $result = Excel::download(
                    new GuestExport($startDate, $endDate),
                    'guests-report.csv',
                    \Maatwebsite\Excel\Excel::CSV
                );
                logger()->debug('CSV export completed');
            } else {
                logger()->debug('Attempting XLSX export');
                $result = Excel::download(
                    new GuestExport($startDate, $endDate),
                    'guests-report.xlsx'
                );
                logger()->debug('XLSX export completed');
            }

            // Log success
            logger()->info('Export completed successfully', [
                'format' => $format,
                'file_size' => $result->getFile()->getSize() ?? 'unknown'
            ]);

            return $result;
        } catch (\InvalidArgumentException $e) {
            logger()->error('Export validation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', $e->getMessage());
        } catch (\Maatwebsite\Excel\Exceptions\NoTypeDetectedException $e) {
            logger()->error('Excel export type detection failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'Could not determine export type');
        } catch (\Exception $e) {
            logger()->error('Export failed unexpectedly', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'Export failed: ' . $e->getMessage());
        }
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,xlsx,xls',
        ]);

        try {
            $file = $request->file('file');

            Log::info('Guest import initiated', [
                'file_name' => $file->getClientOriginalName(),
                'file_type' => $file->getClientMimeType(),
                'file_size_kb' => round($file->getSize() / 1024, 2),
                'uploaded_by_ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            $destinationPath = storage_path('app/temp');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
                Log::info('Created temp directory', ['path' => $destinationPath]);
            }

            $filename = uniqid() . '-' . $file->getClientOriginalName();
            $absolutePath = $file->move($destinationPath, $filename)->getPathname();

            Log::info('File moved successfully', ['path' => $absolutePath]);

            DB::transaction(function () use ($absolutePath) {
                Log::info('Clearing guest-related tables');
                GuestItem::query()->delete();
                GuestLog::query()->delete();
                Guest::query()->delete();

                Log::info('Starting Excel import');
                Excel::import(new GuestsImport, $absolutePath);
            });

            // ✅ Delete the file after successful import
            if (File::exists($absolutePath)) {
                File::delete($absolutePath);
                Log::info('Temporary import file deleted', ['path' => $absolutePath]);
            }

            Log::info('Guest import completed successfully');
            return redirect()->back()->with('success', 'Guests imported successfully!');
        } catch (\Throwable $e) {
            Log::error('Guest import failed', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Import failed: ' . $e->getMessage());
        }
    }
}
