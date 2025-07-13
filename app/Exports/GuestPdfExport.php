<?php

namespace App\Exports;

use App\Models\Guest;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class GuestPdfExport implements FromView
{
    protected $startDate;
    protected $endDate;

    public function __construct($startDate = null, $endDate = null)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function view(): View
    {
        $query = Guest::with('guestLogs');

        if ($this->startDate && $this->endDate) {
            $query->whereHas('guestLogs', function ($q) {
                $q->whereBetween('check_in_time', [$this->startDate, $this->endDate]);
            });
        }

        $guests = $query->get();

        return view('exports.guests', compact('guests'));
    }
}
