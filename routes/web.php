<?php
// routes/web.php
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [ // This return statement should encapsulate the props
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Teacher routes - PUT THESE FIRST (before shared routes)
    Route::middleware(['role:teacher'])->group(function () {
        // Classes
        Route::get('/classes/create', [ClassController::class, 'create'])->name('classes.create');
        Route::post('/classes', [ClassController::class, 'store'])->name('classes.store');
        Route::get('/classes/{class}/edit', [ClassController::class, 'edit'])->name('classes.edit');
        Route::put('/classes/{class}', [ClassController::class, 'update'])->name('classes.update');
        Route::delete('/classes/{class}', [ClassController::class, 'destroy'])->name('classes.destroy');
        
        // Questions
        Route::resource('questions', QuestionController::class);
        Route::post('/questions/{question}/duplicate', [QuestionController::class, 'duplicate'])->name('questions.duplicate');
        Route::post('/questions/{question}/toggle-status', [QuestionController::class, 'toggleStatus'])->name('questions.toggle-status');
        
        // Exams - MOVE THESE BEFORE SHARED ROUTES
        Route::get('/exams/create', [ExamController::class, 'create'])->name('exams.create');
        Route::post('/exams', [ExamController::class, 'store'])->name('exams.store');
        Route::get('/exams/{exam}/edit', [ExamController::class, 'edit'])->name('exams.edit');
        Route::get('/exams/{exam}/results', [ExamController::class, 'results'])->name('exams.results');
        Route::put('/exams/{exam}', [ExamController::class, 'update'])->name('exams.update');
        Route::delete('/exams/{exam}', [ExamController::class, 'destroy'])->name('exams.destroy');
        Route::post('/exams/{exam}/duplicate', [ExamController::class, 'duplicate'])->name('exams.duplicate');
        Route::post('/exams/{exam}/toggle-status', [ExamController::class, 'toggleStatus'])->name('exams.toggle-status');
        Route::post('/exams/{exam}/publish', [ExamController::class, 'publish'])->name('exams.publish');
    });
    
    // Student routes
    Route::middleware(['role:student'])->group(function () {
        Route::get('/classes/join', [StudentController::class, 'showJoinClass'])->name('classes.join');
        Route::post('/classes/join', [StudentController::class, 'joinClass']);
        Route::get('/exams/{exam}/take', [StudentController::class, 'takeExam'])->name('exams.take');
        Route::post('/exams/{exam}/start', [StudentController::class, 'startExam'])->name('exams.start');
        Route::post('/exams/{exam}/submit', [StudentController::class, 'submitExam'])->name('exams.submit');
        Route::get('/exams/{exam}/result', [StudentController::class, 'examResult'])->name('exams.result');
        Route::get('/my-classes', [StudentController::class, 'myClasses'])->name('my-classes');
        Route::get('/my-exams', [StudentController::class, 'myExams'])->name('my-exams');
    });
    
    // Shared routes (both teachers and students) - PUT THESE LAST
    Route::get('/classes', [ClassController::class, 'index'])->name('classes.index');
    Route::get('/classes/{class}', [ClassController::class, 'show'])->name('classes.show');
    Route::get('/exams', [ExamController::class, 'index'])->name('exams.index');
    Route::get('/exams/{exam}', [ExamController::class, 'show'])->name('exams.show');
});

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';