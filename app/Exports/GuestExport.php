<?php

namespace App\Exports;

use App\Models\Guest;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Carbon\Carbon;

class GuestExport implements FromCollection, WithHeadings, WithMapping
{
    protected $startDate;
    protected $endDate;

    public function __construct($startDate = null, $endDate = null)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function collection()
    {
        $query = Guest::with(['guestLogs' => function ($q) {
            if ($this->startDate && $this->endDate) {
                $q->whereBetween('check_in_time', [$this->startDate, $this->endDate]);
            }
        }]);

        return $query->get()->flatMap(function ($guest) {
            if ($guest->guestLogs->isEmpty()) {
                return [
                    (object)[
                        'guest' => $guest,
                        'log' => null
                    ]
                ];
            }

            return $guest->guestLogs->map(function ($log) use ($guest) {
                return (object)[
                    'guest' => $guest,
                    'log' => $log
                ];
            });
        });
    }

    public function headings(): array
    {
        return [
            'Guest ID',
            'Name',
            'ID Type',
            'ID Number',
            'Email',
            'Phone',
            'Company',
            'Address',
            'Agreed to Terms',
            'Check-in Time',
            'Check-out Time',
            'Purpose of Visit',
            'Meeting With'
        ];
    }

    public function map($row): array
    {
        $guest = $row->guest;
        $log = $row->log;

        return [
            $guest->id,
            $guest->name,
            $guest->id_type,
            $guest->id_number,
            $guest->email,
            $guest->phone,
            $guest->company,
            $guest->address,
            $guest->is_agreed ? 'Yes' : 'No',
            $log ? Carbon::parse($log->check_in_time)->format('m/d/Y h:i A') : 'No visits yet',
            $log && $log->check_out_time ? Carbon::parse($log->check_out_time)->format('m/d/Y h:i A') : '',
            $log->purpose_of_visit ?? '',
            $log->meeting_with ?? '',
        ];
    }
}
