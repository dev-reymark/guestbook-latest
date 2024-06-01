<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('guest_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guest_log_id')->constrained()->onDelete('cascade');
            $table->string('item_name')->nullable();
            $table->integer('quantity')->nullable();
            $table->string('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guest_items');
    }
};
