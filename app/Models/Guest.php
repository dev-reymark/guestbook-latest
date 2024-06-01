<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'id_type', 'id_number', 'email', 'phone', 'company', 'address', 'is_agreed',
    ];

    public function guestLogs()
    {
        return $this->hasMany(GuestLog::class);
    }
}
