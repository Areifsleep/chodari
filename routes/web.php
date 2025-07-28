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
    
    // Class routes accessible to all authenticated users
    Route::get('/classes', [ClassController::class, 'index'])->name('classes.index');
    Route::get('/classes/{class}', [ClassController::class, 'show'])->name('classes.show');
    
    // Teacher-only class routes with permission middleware
    Route::middleware(['role:teacher', 'permission:create-classes'])->group(function () {
        Route::get('/classes/create', [ClassController::class, 'create'])->name('classes.create');
        Route::post('/classes', [ClassController::class, 'store'])->name('classes.store');
    });
    
    Route::middleware(['role:teacher', 'permission:edit-classes'])->group(function () {
        Route::get('/classes/{class}/edit', [ClassController::class, 'edit'])->name('classes.edit');
        Route::put('/classes/{class}', [ClassController::class, 'update'])->name('classes.update');
    });
    
    Route::middleware(['role:teacher', 'permission:delete-classes'])->group(function () {
        Route::delete('/classes/{class}', [ClassController::class, 'destroy'])->name('classes.destroy');
    });
    
    // Student-only routes
    Route::middleware(['role:student', 'permission:join-classes'])->group(function () {
        Route::post('/classes/join', [ClassController::class, 'join'])->name('classes.join');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
