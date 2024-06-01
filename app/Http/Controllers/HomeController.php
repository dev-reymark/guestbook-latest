<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Guest;
use App\Models\GuestLog;

class HomeController extends Controller
{
    public function fetchGuestData(Request $request)
    {
        $totalRegisteredGuest = Guest::count();
        $avgLogsInPast7Days = GuestLog::where('check_in_time', '>=', now()->subDays(7))->count();

        return response()->json([
            'totalRegisteredGuest' => $totalRegisteredGuest,
            'avgLogsInPast7Days' => $avgLogsInPast7Days,
        ]);
    }
}
