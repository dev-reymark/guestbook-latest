<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\GuestLogController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Admin/Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/guests', [GuestController::class, 'index'])->name('guest.index');
    Route::get('/generate-report', [GuestController::class, 'generateReport'])->name('guest.generateReport');

    Route::get('/guestlogs', [GuestLogController::class, 'index'])->name('guest.checkout.index');
    Route::delete('/guests/logs/{guestId}', [GuestLogController::class, 'destroy'])->name('guest.log.destroy');
    Route::get('/generate-report-guestlog', [GuestLogController::class, 'generateReport'])->name('guestlog.generateReport');
    Route::get('/generate-report-all-guestlogs', [GuestLogController::class, 'generateReportAllLogs']);
    Route::get('/guest-visits-per-month', [GuestLogController::class, 'guestVisitsPerMonth']);


    Route::get('/reports', [ReportController::class, 'create'])->name('report.create');

    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::get('/upload/all', [UploadController::class, 'show']);
    Route::post('/upload', [UploadController::class, 'upload'])->name('media.upload');
    Route::get('/upload', [UploadController::class, 'create'])->name('media.create');
    Route::delete('/uploads/{id}', [UploadController::class, 'destroy']);
});

Route::middleware('guest')->group(function () {
    Route::get('/', [UploadController::class, 'index'])->name('media.index');

    Route::prefix('guest')->group(function () {
        Route::post('/register', [GuestController::class, 'store'])->name('guest.register');

        Route::get('/check-in', [GuestLogController::class, 'create'])->name('guest.checkin.create');
        Route::post('/check-in/{guestId}', [GuestLogController::class, 'store'])->name('guest.checkin.store');
        Route::get('/check-out', [GuestLogController::class, 'show'])->name('guest.checkout.show');
        Route::post('/check-out/{guestLog}', [GuestLogController::class, 'checkOut'])->name('guest.checkout');
    });

    Route::get('/overdue-guests', [GuestLogController::class, 'getOverdueGuests']);
});





require __DIR__ . '/auth.php';
