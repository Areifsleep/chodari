<?php
// app/Http/Controllers/DashboardController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user()->load('roles');
        
        $data = [
            'user' => $user,
        ];

        if ($user->hasRole('teacher')) {
            $data['stats'] = [
                'classes_count' => $user->teachingClasses()->count(),
                'questions_count' => $user->questions()->count(),
                'exams_count' => $user->createdExams()->count(),
            ];
            $data['recent_classes'] = $user->teachingClasses()
                ->with('students')
                ->latest()
                ->take(5)
                ->get();
        }

        if ($user->hasRole('student')) {
            $data['stats'] = [
                'classes_count' => $user->enrolledClasses()->count(),
                'completed_exams' => $user->examAttempts()
                    ->where('status', 'completed')
                    ->count(),
                'average_score' => $user->examAttempts()
                    ->where('status', 'completed')
                    ->avg('percentage'),
            ];
            $data['recent_exams'] = $user->examAttempts()
                ->with('exam.class')
                ->latest()
                ->take(5)
                ->get();
        }

        return Inertia::render('dashboard', $data);
    }
}