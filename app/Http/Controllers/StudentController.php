<?php
// app/Http/Controllers/StudentController.php
namespace App\Http\Controllers;

use App\Http\Requests\JoinClassRequest;
use App\Models\ClassModel;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\StudentAnswer;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    public function showJoinClass(): Response
    {
        return Inertia::render('Classes/Join');
    }

    public function joinClass(JoinClassRequest $request): RedirectResponse
    {
        $class = ClassModel::where('class_code', $request->class_code)
            ->where('status', 'active')
            ->firstOrFail();

        $user = $request->user();

        // Check if already enrolled
        if ($class->students()->where('user_id', $user->id)->exists()) {
            return back()->withErrors(['class_code' => 'You are already enrolled in this class.']);
        }

        // Check class capacity
        $currentEnrollment = $class->students()->wherePivot('status', 'active')->count();
        if ($currentEnrollment >= $class->max_students) {
            return back()->withErrors(['class_code' => 'This class is full.']);
        }

        // Join the class
        $class->students()->attach($user->id, [
            'status' => 'active',
            'joined_at' => now(),
        ]);

        return redirect()->route('classes.show', $class)
            ->with('message', 'Successfully joined the class!');
    }

    public function myClasses(): Response
    {
        $user = Auth::user();
        
        $classes = $user->enrolledClasses()
            ->wherePivot('status', 'active')
            ->with(['teacher', 'exams' => function($query) {
                $query->where('status', 'published')
                      ->where('start_time', '<=', now())
                      ->where('end_time', '>=', now());
            }])
            ->withCount(['exams as total_exams'])
            ->get();

        return Inertia::render('Students/MyClasses', [
            'classes' => $classes,
        ]);
    }

    public function myExams(): Response
    {
        $user = Auth::user();
        
        // Get all exams from enrolled classes
        $exams = Exam::whereHas('class.students', function($query) use ($user) {
                $query->where('user_id', $user->id)
                      ->wherePivot('status', 'active');
            })
            ->where('status', 'published')
            ->with(['class', 'teacher'])
            ->withCount('questions')
            ->latest()
            ->get();

        // Get user's attempts for these exams
        $attempts = $user->examAttempts()
            ->whereIn('exam_id', $exams->pluck('id'))
            ->with('exam')
            ->get()
            ->keyBy('exam_id');

        // Add attempt info to exams
        $exams = $exams->map(function($exam) use ($attempts) {
            $exam->user_attempt = $attempts->get($exam->id);
            return $exam;
        });

        return Inertia::render('Students/MyExams', [
            'exams' => $exams,
        ]);
    }

    public function takeExam(Exam $exam): Response
    {
        $user = Auth::user();
        
        // Check if student can take this exam
        abort_unless($exam->status === 'published', 403, 'This exam is not available.');
        abort_unless($exam->class->students()->where('user_id', $user->id)->exists(), 403);
        abort_unless(now()->between($exam->start_time, $exam->end_time), 403, 'Exam is not currently available.');
        
        // Check if student has attempts left
        $attemptCount = $exam->attempts()->where('student_id', $user->id)->count();
        abort_if($attemptCount >= $exam->max_attempts, 403, 'No attempts remaining.');
        
        // Get or create current attempt
        $attempt = $exam->attempts()
            ->where('student_id', $user->id)
            ->where('status', 'in_progress')
            ->first();
            
        if (!$attempt) {
            // Create new attempt
            $attempt = $exam->attempts()->create([
                'student_id' => $user->id,
                'attempt_number' => $attemptCount + 1,
                'started_at' => now(),
                'total_questions' => $exam->questions()->count(),
                'status' => 'in_progress',
            ]);
        }
        
        // Get exam questions (shuffled if needed)
        $questions = $exam->questions()
            ->orderBy($exam->shuffle_questions ? DB::raw('RANDOM()') : 'exam_question.question_order')
            ->get();
            
        // Get existing answers
        $existingAnswers = $attempt->answers()
            ->pluck('selected_answer', 'question_id')
            ->toArray();
            
        // Calculate time remaining
        $elapsedMinutes = now()->diffInMinutes($attempt->started_at);
        $timeRemaining = max(0, ($exam->duration_minutes * 60) - ($elapsedMinutes * 60));
        
        return Inertia::render('Exams/Take', [
            'exam' => $exam->load('class', 'teacher'),
            'attempt' => $attempt,
            'questions' => $questions,
            'existing_answers' => $existingAnswers,
            'time_remaining' => $timeRemaining,
        ]);
    }
    
    public function startExam(Request $request, Exam $exam): RedirectResponse
    {
        // This method can be used to start an exam attempt
        // For now, redirect to take exam
        return redirect()->route('exams.take', $exam);
    }
    
    public function saveProgress(Request $request, Exam $exam): RedirectResponse
    {
        $user = Auth::user();
        
        $attempt = $exam->attempts()
            ->where('student_id', $user->id)
            ->where('status', 'in_progress')
            ->firstOrFail();
            
        $answers = $request->input('answers', []);
        
        foreach ($answers as $questionId => $selectedAnswer) {
            if (in_array($selectedAnswer, ['a', 'b', 'c', 'd'])) {
                StudentAnswer::updateOrCreate([
                    'attempt_id' => $attempt->id,
                    'question_id' => $questionId,
                ], [
                    'selected_answer' => $selectedAnswer,
                    'answered_at' => now(),
                ]);
            }
        }
        
        return back();
    }
    
    public function submitExam(Request $request, Exam $exam): RedirectResponse
    {
        $user = Auth::user();
        
        $attempt = $exam->attempts()
            ->where('student_id', $user->id)
            ->where('status', 'in_progress')
            ->firstOrFail();
            
        DB::transaction(function () use ($request, $exam, $attempt) {
            $answers = $request->input('answers', []);
            $correctAnswers = 0;
            $totalPoints = 0;
            $earnedPoints = 0;
            
            // Save final answers and calculate score
            foreach ($exam->questions as $question) {
                $selectedAnswer = $answers[$question->id] ?? null;
                $isCorrect = $selectedAnswer === $question->correct_answer;
                $questionPoints = $question->pivot->points ?? 1;
                $earnedQuestionPoints = $isCorrect ? $questionPoints : 0;
                
                StudentAnswer::updateOrCreate([
                    'attempt_id' => $attempt->id,
                    'question_id' => $question->id,
                ], [
                    'selected_answer' => $selectedAnswer,
                    'is_correct' => $isCorrect,
                    'points_earned' => $earnedQuestionPoints,
                    'answered_at' => now(),
                ]);
                
                if ($isCorrect) $correctAnswers++;
                $totalPoints += $questionPoints;
                $earnedPoints += $earnedQuestionPoints;
            }
            
            // Update attempt
            $percentage = $totalPoints > 0 ? ($earnedPoints / $totalPoints) * 100 : 0;
            
            $attempt->update([
                'completed_at' => now(),
                'submitted_at' => now(),
                'score' => $earnedPoints,
                'percentage' => $percentage,
                'correct_answers' => $correctAnswers,
                'incorrect_answers' => $attempt->total_questions - $correctAnswers,
                'unanswered_questions' => $attempt->total_questions - collect($answers)->count(),
                'status' => 'completed',
            ]);
        });
        
        return redirect()->route('exams.result', $exam)
            ->with('message', 'Exam submitted successfully!');
    }
    
    public function examResult(Exam $exam): Response
    {
        $user = Auth::user();
        
        $attempt = $exam->attempts()
            ->where('student_id', $user->id)
            ->where('status', 'completed')
            ->with(['answers.question'])
            ->latest()
            ->firstOrFail();
            
        return Inertia::render('Exams/Result', [
            'exam' => $exam->load('class'),
            'attempt' => $attempt,
            'show_answers' => $exam->allow_review,
        ]);
    }

    public function leaveClass(ClassModel $class): RedirectResponse
    {
        $user = Auth::user();
        
        // Check if user is enrolled
        $enrollment = $class->students()->where('user_id', $user->id)->first();
        
        if (!$enrollment) {
            return back()->withErrors(['message' => 'You are not enrolled in this class.']);
        }
        
        // Update enrollment status
        $class->students()->updateExistingPivot($user->id, [
            'status' => 'inactive',
            'left_at' => now()
        ]);
        
        return redirect()->route('my-classes')
            ->with('message', 'Successfully left the class.');
    }
}