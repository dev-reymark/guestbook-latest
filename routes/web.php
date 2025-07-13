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
use App\Http\Controllers\DatabaseBackupController;

Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        // 'canRegister' => Route::has('register'),
        // 'laravelVersion' => Application::VERSION,
        // 'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Admin/Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::prefix('guests')->group(function () {
        // Display all guests
        Route::get('/', [GuestController::class, 'index'])->name('guests.index');
        // Update guest
        Route::put('/{id}', [GuestController::class, 'update'])->name('guest.update');
        // Delete guest
        Route::delete('/{id}', [GuestController::class, 'destroy'])->name('guest.destroy');
        // Generate PDF report
        Route::get('/generate-report', [GuestController::class, 'generateReport'])->name('guests.generateReport');
    });

    Route::prefix('guestlogs')->group(function () {
        Route::get('/', [GuestLogController::class, 'index'])->name('guestlogs.index');
        Route::put('/{logId}', [GuestLogController::class, 'update'])->name('guestlog.update');
        Route::delete('/{logId}', [GuestLogController::class, 'destroy'])->name('guestlog.destroy');
        Route::get('/generate-report-guestlog', [GuestLogController::class, 'generateReport'])->name('guestlog.generateReport');
        Route::get('/generate-report-all-guestlogs', [GuestLogController::class, 'generateReportAllLogs']);
        Route::get('/guest-visits-per-month', [GuestLogController::class, 'guestVisitsPerMonth']);
    });

    Route::prefix('reports')->group(function () {
        Route::get('/', [ReportController::class, 'create'])->name('reports.create');
        Route::get('/export', [ReportController::class, 'export'])->name('guests.export');
        Route::post('/import', [ReportController::class, 'import'])->name('guests.import');
    });

    Route::prefix('/media')->group(function () {
        Route::get('/', [UploadController::class, 'create'])->name('media.create');
        Route::post('/', [UploadController::class, 'upload'])->name('media.upload');
        Route::get('/all', [UploadController::class, 'show']);
        Route::delete('/{id}', [UploadController::class, 'destroy']);
    });

    Route::prefix('backups')->group(function () {
        Route::get('/', [DatabaseBackupController::class, 'index'])->name('backups.index');
        Route::post('/', [DatabaseBackupController::class, 'store'])->name('backups.store');
        Route::get('/download/{filename}', [DatabaseBackupController::class, 'download'])->name('backups.download');
        Route::delete('/{filename}', [DatabaseBackupController::class, 'destroy'])->name('backups.destroy');
    });
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
