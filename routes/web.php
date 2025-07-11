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
});

Route::get('/guest/register', [GuestController::class, 'create'])->name('guest.register');
Route::post('/guest/register', [GuestController::class, 'store'])->name('guest.store');
Route::get('/guests', [GuestController::class, 'index'])->name('guest.index');
Route::delete('/guests/{id}', [GuestController::class, 'destroy'])->name('guest.destroy');
Route::delete('/guests', [GuestController::class, 'destroyAll'])->name('guest.destroy_all');
Route::get('/generate-report', [GuestController::class, 'generateReport'])->name('guest.generateReport');

Route::post('/guest/log/new/{guestId}', [GuestLogController::class, 'store'])->name('guest.log.store');
Route::get('/guest/log/new', [GuestLogController::class, 'create'])->name('guestlog.create');
Route::get('/guest/logs', [GuestLogController::class, 'index'])->name('guest.log.index');
Route::get('/guest/logs/all', [GuestLogController::class, 'show'])->name('guest.log.show');
Route::delete('/guests/logs/{guestId}', [GuestLogController::class, 'destroy'])->name('guest.log.destroy');
Route::post('/guest/log/check-out/{guestLog}', [GuestLogController::class, 'checkOut'])->name('guest.log.checkout');
Route::get('/generate-report-guestlog', [GuestLogController::class, 'generateReport'])->name('guestlog.generateReport');
Route::get('/generate-report-all-guestlogs', [GuestLogController::class, 'generateReportAllLogs']);
Route::get('/guest-visits-per-month', [GuestLogController::class, 'guestVisitsPerMonth']);
Route::get('/overdue-guests', [GuestLogController::class, 'getOverdueGuests']);

Route::get('/reports', [ReportController::class, 'create'])->name('report.create');

Route::get('/dashboard', DashboardController::class)->name('dashboard');

Route::post('/upload', [UploadController::class, 'upload'])->name('media.upload');
Route::get('/upload', [UploadController::class, 'create'])->name('media.create');
Route::get('/', [UploadController::class, 'index'])->name('media.index');
Route::get('/upload/all', [UploadController::class, 'show']);
Route::delete('/uploads/{id}', [UploadController::class, 'destroy']);

require __DIR__ . '/auth.php';
