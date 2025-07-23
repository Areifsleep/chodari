<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\StudentController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Profile routes
    // Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    // Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Teacher routes
    Route::middleware(['role:teacher'])->group(function () {
        Route::resource('classes', ClassController::class);
        Route::resource('questions', QuestionController::class);
        Route::resource('exams', ExamController::class);
    });
    
    // Student routes
    Route::middleware(['role:student'])->group(function () {
        Route::get('classes/join', [StudentController::class, 'showJoinClass'])->name('classes.join');
        Route::post('classes/join', [StudentController::class, 'joinClass']);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
