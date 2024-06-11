<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\GuestLog;

class CheckOutGuestsCommand extends Command
{
    protected $signature = 'guests:checkout';
    protected $description = 'Check out guests who haven\'t checked out by 4 pm';

    public function handle()
    {
        // Query for guests who haven't checked out yet
        $guestLogs = GuestLog::whereNull('check_out_time')->get();

        // Check out guests
        foreach ($guestLogs as $guestLog) {
            $guestLog->update(['check_out_time' => now()]);
            
            // Optionally, send notifications to guests reminding them to check out
            // $guestLog->guest->sendCheckOutReminderNotification();
        }

        $this->info('Guests checked out successfully.');
    }
}
