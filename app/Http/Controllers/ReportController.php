<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exports\GuestExport;
use App\Exports\GuestPdfExport;
use App\Imports\GuestsImport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function create()
    {
        return inertia('Admin/Report/GuestReport');
    }

    public function export(Request $request)
    {
        $format = $request->format;
        $startDate = $request->start_date;
        $endDate = $request->end_date;

        if ($format === 'pdf') {
            $pdf = Pdf::loadView('exports.guests', [
                'guests' => (new GuestExport($startDate, $endDate))->collection(),
                'startDate' => $startDate,
                'endDate' => $endDate
            ]);
            return $pdf->download('guests-report.pdf');
        }

        if ($format === 'csv') {
            return Excel::download(new GuestExport($startDate, $endDate), 'guests-report.csv', \Maatwebsite\Excel\Excel::CSV);
        }

        return Excel::download(new GuestExport($startDate, $endDate), 'guests-report.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,xlsx,xls'
        ]);

        Excel::import(new GuestsImport, $request->file('file'));

        return redirect()->back()->with('success', 'Guests imported successfully!');
    }
}
