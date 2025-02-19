<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class BackupDatabase extends Command
{
    protected $signature = 'db:backup';
    protected $description = 'Backup the database';

    public function handle()
    {
        $filename = "backup-" . now()->format('Y-m-d_H-i-s') . ".sql";
        $path = storage_path('app/db-backups/' . $filename);

        // Ensure the backups directory exists
        Storage::disk('local')->makeDirectory('db-backups');

        // Run the mysqldump command
       // $command = "mysqldump --user=" . env('DB_USERNAME') .
         //          " --password=" . env('DB_PASSWORD') .
           //        " --host=" . env('DB_HOST') .
             //      " " . env('DB_DATABASE') . " > " . $path;

	$command = "mysqldump --defaults-extra-file=/home/phmladscwebserver/.my.cnf " . 
               env('DB_DATABASE') . " > " . escapeshellarg($path);

        $returnVar = null;
        $output = null;

        exec($command, $output, $returnVar);

        if ($returnVar === 0) {
            $this->info('Database backup was successful.');
        } else {
            $this->error('Database backup failed.');
        }
    }
}
