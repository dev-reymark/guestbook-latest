<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuestLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'guest_id', 'meeting_with', 'purpose_of_visit', 'check_in_time', 'check_out_time'
    ];

    public function guest()
    {
        return $this->belongsTo(Guest::class, 'guest_id');
    }

    public function guestItems()
    {
        return $this->hasMany(GuestItem::class);
    }
}
