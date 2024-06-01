<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\GuestLog;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function __invoke()
    {
        // Count of registered guests
        $totalRegisteredGuest = Guest::count();

        // Count of all guest logs
        $totalGuestLogs = GuestLog::count();

        // Calculate the date range for last week
        $lastWeekStartDate = Carbon::now()->subWeek()->startOfWeek();
        $lastWeekEndDate = Carbon::now()->subWeek()->endOfWeek();

        // Count of guests registered last week
        $guestsRegisteredLastWeek = Guest::whereBetween('created_at', [$lastWeekStartDate, $lastWeekEndDate])->count();

        // Count of guest logs from last week
        $guestLogsLastWeek = GuestLog::whereBetween('created_at', [$lastWeekStartDate, $lastWeekEndDate])->count();

        // Calculate the percentage change for registered guests
        $guestsPercentChange = $totalRegisteredGuest != 0 ? (($totalRegisteredGuest - $guestsRegisteredLastWeek) / $totalRegisteredGuest) * 100 : 0;

        // Calculate the percentage change for guest logs
        $guestLogsPercentChange = $totalGuestLogs != 0 ? (($totalGuestLogs - $guestLogsLastWeek) / $totalGuestLogs) * 100 : 0;

        return Inertia::render('Dashboard', [
            // Guest
            'totalRegisteredGuest' => $totalRegisteredGuest,
            'guestsRegisteredLastWeek' => $guestsRegisteredLastWeek,
            'guestsPercentChange' => $guestsPercentChange,
            // Guest Log
            'totalGuestLogs' => $totalGuestLogs,
            'guestLogsLastWeek' => $guestLogsLastWeek,
            'guestLogsPercentChange' => $guestLogsPercentChange
        ]);
    }
}
