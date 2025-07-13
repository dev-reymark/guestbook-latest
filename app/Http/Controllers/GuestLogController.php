<?php

namespace App\Http\Controllers;

use App\Models\GuestLog;
use App\Models\Guest;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GuestLogController extends Controller
{
    public function create()
    {
        $guests = Guest::all();
        return inertia('Guest/CheckIn', [
            'guests' => $guests,
            'name' => session('name'),
        ]);
    }

    public function store(Request $request, $guestId)
    {
        Log::info('Guest registration request received', ['request' => $request->all()]);

        try {
            $validated = $request->validate([
                'meeting_with' => 'nullable|string|max:255',
                'purpose_of_visit' => 'required|string|max:255',
                'check_in_time' => 'required|date',
            ]);

            $guest = Guest::findOrFail($guestId);

            $checkInTime = Carbon::parse($validated['check_in_time']);

            $guestLogData = array_merge($validated, [
                'guest_id' => $guestId,
                'check_in_time' => $checkInTime,
            ]);


            $guestLog = GuestLog::create($guestLogData);

            Log::info('Guest checked in successfully', [
                'guest_id' => $guestId,
                'guest_name' => $guest->name,
                'log_id' => $guestLog->id,
                'meeting_with' => $validated['meeting_with']
            ]);

            return redirect()->route('guest.checkout.show')
                ->with('success', 'Check-in recorded!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Guest check-in validation failed', [
                'guest_id' => $guestId,
                'errors' => $e->errors(),
                'input' => $request->except(['_token']),
            ]);

            throw $e;
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Guest not found during check-in', [
                'guest_id' => $guestId,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Guest not found. Please register first.');
        } catch (\Exception $e) {
            Log::error('Guest check-in failed', [
                'guest_id' => $guestId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'input' => $request->except(['_token']),
            ]);

            return back()->with(
                'error',
                'Check-in failed. Please try again or contact support if the problem persists.'
            );
        }
    }

    public function show()
    {
        $guestLogs = GuestLog::with('guest')->get();
        return inertia('Guest/CheckOut', [
            'guestLogs' => $guestLogs
        ]);
    }

    public function checkOut(GuestLog $guestLog)
    {
        try {
            // Verify the guest hasn't already checked out
            if ($guestLog->check_out_time) {
                Log::warning('Attempted duplicate check-out', [
                    'log_id' => $guestLog->id,
                    'guest_id' => $guestLog->guest_id,
                ]);

                return redirect()->route('guest.checkout.show')
                    ->with('error', 'Guest has already checked out');
            }

            // Update check-out time with server time
            $guestLog->update([
                'check_out_time' => now()
            ]);

            // Log successful check-out
            Log::info('Guest checked out successfully', [
                'log_id' => $guestLog->id,
                'guest_id' => $guestLog->guest_id,
                'guest_name' => $guestLog->guest->name,
            ]);

            return redirect()->route('guest.checkout.show')
                ->with('success', 'Check out recorded. Thank you!');
        } catch (\Exception $e) {
            // Log unexpected errors
            Log::error('Guest check-out failed', [
                'log_id' => $guestLog->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->route('guest.checkout.show')
                ->with('error', 'Check-out failed. Please try again or contact support.');
        }
    }

    public function getOverdueGuests(Request $request)
    {
        $thresholdMinutes = $request->get('threshold', 10);
        $now = Carbon::now();
        $overdueThreshold = $now->copy()->subMinutes($thresholdMinutes);
        $maxWindow = $now->copy()->subHours(48);
        $excludePurposes = ['OJT/Interns'];

        $overdueGuests = GuestLog::whereNull('check_out_time')
            ->whereBetween('check_in_time', [$maxWindow, $overdueThreshold])
            ->whereNotIn(DB::raw('LOWER(purpose_of_visit)'), array_map('strtolower', $excludePurposes))
            ->with('guest')
            ->orderBy('check_in_time')
            ->get();

        return response()->json($overdueGuests);
    }

    public function index()
    {
        $guestLogs = GuestLog::with('guest')
            ->orderBy('guest_id', 'asc')
            ->get();

        return inertia('Admin/GuestLog/Index', [
            'guestLogs' => $guestLogs
        ]);
    }

    public function update(Request $request, $logId)
    {
        try {
            $validated = $request->validate([
                'meeting_with' => 'nullable|string|max:255',
                'purpose_of_visit' => 'required|string|max:255',
                'check_in_time' => 'required|date',
                'check_out_time' => 'nullable|date|after_or_equal:check_in_time',
            ]);

            $guestLog = GuestLog::findOrFail($logId);

            $guestLog->update([
                'meeting_with' => $validated['meeting_with'],
                'purpose_of_visit' => $validated['purpose_of_visit'],
                'check_in_time' => Carbon::parse($validated['check_in_time']),
                'check_out_time' => $validated['check_out_time']
                    ? Carbon::parse($validated['check_out_time'])
                    : null,
            ]);

            Log::info('Guest log updated successfully', [
                'log_id' => $logId,
                'guest_id' => $guestLog->guest_id,
            ]);

            return redirect()->back()->with('success', 'Guest log updated successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Guest log update validation failed', [
                'log_id' => $logId,
                'errors' => $e->errors(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::error('Guest log update failed', [
                'log_id' => $logId,
                'error' => $e->getMessage(),
            ]);
            return back()->with('error', 'Failed to update guest log');
        }
    }

    public function destroy($logId)
    {
        try {
            $guestLog = GuestLog::findOrFail($logId);
            $guestLog->delete();

            Log::info('Guest log deleted successfully', [
                'log_id' => $logId,
                'guest_id' => $guestLog->guest_id,
            ]);

            return redirect()->back()->with('success', 'Guest log deleted successfully');
        } catch (\Exception $e) {
            Log::error('Guest log deletion failed', [
                'log_id' => $logId,
                'error' => $e->getMessage(),
            ]);
            return back()->with('error', 'Failed to delete guest log');
        }
    }

    public function guestVisitsPerMonth()
    {
        $guestVisitsPerMonth = GuestLog::selectRaw('COUNT(*) as total_visits, MONTH(check_in_time) as month')
            ->groupByRaw('MONTH(check_in_time)')
            ->get();

        $data = [
            'labels' => [],
            'datasets' => [
                [
                    'label' => 'Guest Visits',
                    'data' => []
                ]
            ]
        ];

        foreach ($guestVisitsPerMonth as $visit) {
            $data['labels'][] = date("F", mktime(0, 0, 0, $visit->month, 1));
            $data['datasets'][0]['data'][] = $visit->total_visits;
        }

        return response()->json($data);
    }
}
