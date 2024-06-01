<?php

namespace App\Http\Controllers;

use App\Models\GuestLog;
use App\Models\Guest;
use Illuminate\Http\Request;

class GuestLogController extends Controller
{
    public function create()
    {
        $guests = Guest::all();
        return inertia('GuestLog/GuestLogForm', [
            'guests' => $guests
        ]);
    }

    public function store(Request $request, $guestId)
    {
        $request->validate([
            'meeting_with' => 'nullable|string|max:255',
            'purpose_of_visit' => 'nullable|string|max:255',
            'check_in_time' => 'required|date',
            'check_out_time' => 'nullable|date',
            'guest_items' => 'array',
            'guest_items.*.item_name' => 'nullable|string|max:255',
            'guest_items.*.quantity' => 'nullable|integer|min:1',
            'guest_items.*.remarks' => 'nullable|string|max:255',
        ]);

        // Create guest log entry
        $guestLogData = $request->only(['meeting_with', 'purpose_of_visit', 'check_in_time', 'check_out_time']);
        $guestLogData['guest_id'] = $guestId;
        $guestLog = GuestLog::create($guestLogData);

        // Store guest items
        foreach ($request->guest_items as $item) {
            $guestLog->guestItems()->create([
                'item_name' => $item['item_name'],
                'quantity' => $item['quantity'],
                'remarks' => $item['remarks'],
            ]);
        }

        return redirect()->route('guest.log.index')->with('success', 'Guest log created successfully!');
    }


    public function index()
    {
        // $guestLogs = GuestLog::all();
        $guestLogs = GuestLog::with('guest')->get();
        return inertia('GuestLog/Index', [
            'guestLogs' => $guestLogs
        ]);
    }

    public function show()
    {
        $guestLogs = GuestLog::with('guest')->get();
        return inertia('CheckOut', [
            'guestLogs' => $guestLogs
        ]);
    }

    public function destroy($id)
    {
        $guestLog = GuestLog::findOrFail($id);
        $guestLog->delete();
        return redirect()->route('guest.log.index')->with('success', 'Guest log deleted successfully!');
    }

    public function destroyAll()
    {
        GuestLog::query()->delete();
        return redirect()->route('guest.log.index')->with('success', 'All guest logs deleted successfully!');
    }

    public function checkOut(GuestLog $guestLog)
    {
        // Update the check-out time for the specified guest log
        $guestLog->update(['check_out_time' => now()]);

        return redirect()->route('guest.log.show')->with('success', 'Guest checked out successfully!');
    }

    public function generateReport(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $start_date = $request->input('start_date');
        $end_date = $request->input('end_date');

        $guests = GuestLog::whereBetween('check_in_time', [$start_date, $end_date])->get();

        $pdf = app('dompdf.wrapper')->loadView('guestlog', ['guests' => $guests]);

        return $pdf->download('GuestLogsReportfrom' . $start_date . 'to' . $end_date . '.pdf');
    }

    public function generateReportAllLogs(Request $request)
    {
        // Fetch all guest logs
        $guests = GuestLog::all();

        // Generate PDF report for all logs
        $pdf = app('dompdf.wrapper')->loadView('guestlog', ['guests' => $guests]);

        // Download the PDF
        return $pdf->download('all_guest_logs_report.pdf');
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
