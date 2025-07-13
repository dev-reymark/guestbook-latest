<?php

namespace App\Exports;

use App\Models\Guest;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

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
        $query = Guest::with('guestLogs');

        if ($this->startDate && $this->endDate) {
            $query->whereHas('guestLogs', function ($q) {
                $q->whereBetween('check_in_time', [$this->startDate, $this->endDate]);
            });
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'ID Type',
            'ID Number',
            'Email',
            'Phone',
            'Company',
            'Address',
            'Agreed to Terms',
            'Last Visit Date',
            'Total Visits'
        ];
    }

    public function map($guest): array
    {
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
            optional($guest->guestLogs->last())->check_in_time,
            $guest->guestLogs->count()
        ];
    }
}
