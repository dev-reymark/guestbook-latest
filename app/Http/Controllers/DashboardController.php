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
        $totalRegisteredGuest = Guest::count();
        $totalGuestLogs = GuestLog::count();
        $lastWeekStartDate = Carbon::now()->subWeek()->startOfWeek();
        $lastWeekEndDate = Carbon::now()->subWeek()->endOfWeek();
        $guestsRegisteredLastWeek = Guest::whereBetween('created_at', [$lastWeekStartDate, $lastWeekEndDate])->count();
        $guestLogsLastWeek = GuestLog::whereBetween('created_at', [$lastWeekStartDate, $lastWeekEndDate])->count();
        $guestsPercentChange = $totalRegisteredGuest != 0 ? (($totalRegisteredGuest - $guestsRegisteredLastWeek) / $totalRegisteredGuest) * 100 : 0;
        $guestLogsPercentChange = $totalGuestLogs != 0 ? (($totalGuestLogs - $guestLogsLastWeek) / $totalGuestLogs) * 100 : 0;

        return Inertia::render('Admin/Dashboard', [
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
