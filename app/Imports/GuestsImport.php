<?php

namespace App\Imports;

use App\Models\Guest;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class GuestsImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return new Guest([
            'name' => $row['name'] ?? $row['Name'] ?? null,
            'id_type' => $row['id_type'] ?? $row['ID Type'] ?? null,
            'id_number' => $row['id_number'] ?? $row['ID Number'] ?? null,
            'email' => $row['email'] ?? $row['Email'] ?? null,
            'phone' => $row['phone'] ?? $row['Phone'] ?? null,
            'company' => $row['company'] ?? $row['Company'] ?? null,
            'address' => $row['address'] ?? $row['Address'] ?? null,
            'is_agreed'  => true,
        ]);
    }
}
