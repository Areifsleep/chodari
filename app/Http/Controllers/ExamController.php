<?php
// app/Http/Controllers/ExamController.php
namespace App\Http\Controllers;

use App\Http\Requests\CreateExamRequest;
use App\Http\Requests\UpdateExamRequest;
use App\Models\Exam;
use App\Models\ClassModel;
use App\Models\Question;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ExamController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        
        $exams = $user->createdExams()
            ->with(['class', 'questions'])
            ->withCount(['questions', 'attempts'])
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->class_id, function ($query, $classId) {
                $query->where('class_id', $classId);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $classes = $user->teachingClasses()
            ->where('is_active', true)
            ->get(['id', 'name']);

        return Inertia::render('Exams/Index', [
            'exams' => $exams,
            'classes' => $classes,
            'filters' => $request->only(['search', 'status', 'class_id']),
            'stats' => [
                'total' => $user->createdExams()->count(),
                'published' => $user->createdExams()->where('status', 'published')->count(),
                'draft' => $user->createdExams()->where('status', 'draft')->count(),
                'completed' => $user->createdExams()->where('status', 'completed')->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        $user = Auth::user();
        
        $classes = $user->teachingClasses()
            ->where('is_active', true)
            ->withCount(['students as students_count' => function($query) {
                $query->wherePivot('status', 'active');
            }])
            ->get();

            $questions = $user->questions()
            ->where('is_active', true)
            ->latest()
            ->paginate(50);

            $subjects = $user->questions()
            ->whereNotNull('subject')
            ->distinct()
            ->pluck('subject')
            ->sort()
            ->values()
            ->toArray();

        return Inertia::render('Exams/Create', [
            'classes' => $classes,
            'questions' => $questions,
            'subjects' => $subjects,
        ]);
    }

    public function store(CreateExamRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            // Create exam
            $exam = $request->user()->createdExams()->create([
                'title' => $request->title,
                'description' => $request->description,
                'class_id' => $request->class_id,
                'duration_minutes' => $request->duration_minutes,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'shuffle_questions' => $request->shuffle_questions ?? false,
                'show_results_immediately' => $request->show_results_immediately ?? true,
                'allow_review' => $request->allow_review ?? true,
                'passing_score' => $request->passing_score ?? 60,
                'max_attempts' => $request->max_attempts ?? 1,
                'status' => $request->status ?? 'draft',
            ]);

            // Attach questions with order and points
            if ($request->has('selected_questions')) {
                foreach ($request->selected_questions as $index => $questionData) {
                    $exam->questions()->attach($questionData['id'], [
                        'question_order' => $index + 1,
                        'points' => $questionData['points'] ?? 1.0,
                    ]);
                }
            }
        });

        return redirect()->route('exams.index')
            ->with('message', 'Exam created successfully!');
    }

    public function show(Exam $exam): Response
    {
        // Ensure user owns this exam
        abort_unless($exam->teacher_id === Auth::id(), 403);

        $exam->load([
            'class.students',
            'teacher',
            'questions' => function($query) {
                $query->orderBy('exam_question.question_order');
            },
            'attempts.student'
        ]);

        return Inertia::render('Exams/Show', [
            'exam' => $exam,
            'can_edit' => $exam->status === 'draft',
            'stats' => [
                'total_students' => $exam->class->students()->wherePivot('status', 'active')->count(),
                'attempts_count' => $exam->attempts()->count(),
                'completed_count' => $exam->attempts()->where('status', 'completed')->count(),
                'average_score' => $exam->attempts()->where('status', 'completed')->avg('percentage'),
            ],
        ]);
    }

    public function edit(Exam $exam): Response
    {
        abort_unless($exam->teacher_id === Auth::id(), 403);
        abort_unless($exam->status === 'draft', 403, 'Cannot edit published exam');

        $user = Auth::user();
        
        $classes = $user->teachingClasses()
            ->where('is_active', true)
            ->withCount(['students as students_count' => function($query) {
                $query->wherePivot('status', 'active');
            }])
            ->get();

        $questions = $user->questions()
            ->where('is_active', true)
            ->get(['id', 'question_text', 'subject', 'difficulty']);

        $exam->load(['questions' => function($query) {
            $query->orderBy('exam_question.question_order')
                  ->withPivot('points', 'question_order');
        }]);

        return Inertia::render('Exams/Edit', [
            'exam' => $exam,
            'classes' => $classes,
            'questions' => $questions,
        ]);
    }

    public function update(UpdateExamRequest $request, Exam $exam): RedirectResponse
    {
        abort_unless($exam->teacher_id === Auth::id(), 403);
        abort_unless($exam->status === 'draft', 403, 'Cannot edit published exam');

        DB::transaction(function () use ($request, $exam) {
            // Update exam details
            $exam->update([
                'title' => $request->title,
                'description' => $request->description,
                'class_id' => $request->class_id,
                'duration_minutes' => $request->duration_minutes,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'shuffle_questions' => $request->shuffle_questions ?? false,
                'show_results_immediately' => $request->show_results_immediately ?? true,
                'allow_review' => $request->allow_review ?? true,
                'passing_score' => $request->passing_score ?? 60,
                'max_attempts' => $request->max_attempts ?? 1,
                'status' => $request->status ?? 'draft',
            ]);

            // Sync questions
            $exam->questions()->detach();
            if ($request->has('selected_questions')) {
                foreach ($request->selected_questions as $index => $questionData) {
                    $exam->questions()->attach($questionData['id'], [
                        'question_order' => $index + 1,
                        'points' => $questionData['points'] ?? 1.0,
                    ]);
                }
            }
        });

        return redirect()->route('exams.show', $exam)
            ->with('message', 'Exam updated successfully!');
    }

    public function destroy(Exam $exam): RedirectResponse
    {
        abort_unless($exam->teacher_id === Auth::id(), 403);
        
        // Cannot delete if there are attempts
        if ($exam->attempts()->exists()) {
            return back()->withErrors([
                'exam' => 'Cannot delete exam that has student attempts.'
            ]);
        }

        $exam->delete();

        return redirect()->route('exams.index')
            ->with('message', 'Exam deleted successfully!');
    }

    public function publish(Exam $exam): RedirectResponse
    {
        abort_unless($exam->teacher_id === Auth::id(), 403);
        abort_unless($exam->status === 'draft', 403);

        // Validate exam has questions
        if ($exam->questions()->count() === 0) {
            return back()->withErrors([
                'exam' => 'Cannot publish exam without questions.'
            ]);
        }

        $exam->update(['status' => 'published']);

        return back()->with('message', 'Exam published successfully!');
    }

    public function duplicate(Exam $exam): RedirectResponse
    {
        abort_unless($exam->teacher_id === Auth::id(), 403);

        DB::transaction(function () use ($exam) {
            $newExam = $exam->replicate();
            $newExam->title = $exam->title . ' (Copy)';
            $newExam->status = 'draft';
            $newExam->save();

            // Copy questions
            foreach ($exam->questions as $question) {
                $newExam->questions()->attach($question->id, [
                    'question_order' => $question->pivot->question_order,
                    'points' => $question->pivot->points,
                ]);
            }
        });

        return redirect()->route('exams.index')
            ->with('message', 'Exam duplicated successfully!');
    }

    public function results(Exam $exam): Response
    {
        abort_unless($exam->teacher_id === Auth::id(), 403);

        $exam->load([
            'class',
            'attempts' => function($query) {
                $query->with('student')
                      ->where('status', 'completed')
                      ->orderBy('percentage', 'desc');
            },
            'questions'
        ]);

        return Inertia::render('Exams/Results', [
            'exam' => $exam,
            'analytics' => [
                'total_attempts' => $exam->attempts()->where('status', 'completed')->count(),
                'average_score' => $exam->attempts()->where('status', 'completed')->avg('percentage'),
                'highest_score' => $exam->attempts()->where('status', 'completed')->max('percentage'),
                'lowest_score' => $exam->attempts()->where('status', 'completed')->min('percentage'),
                'passing_rate' => $exam->attempts()->where('status', 'completed')
                    ->where('percentage', '>=', $exam->passing_score)
                    ->count() / max($exam->attempts()->where('status', 'completed')->count(), 1) * 100,
            ],
        ]);
    }
}