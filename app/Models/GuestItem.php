<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuestItem extends Model
{
    use HasFactory;

    protected $fillable = ['guest_log_id', 'item_name', 'quantity', 'remarks'];

    public function guestLog()
    {
        return $this->belongsTo(GuestLog::class, 'guest_log_id');
    }
}
