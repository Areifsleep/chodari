<?php
// app/Http/Controllers/QuestionController.php
namespace App\Http\Controllers;

use App\Http\Requests\CreateQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use App\Models\Question;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class QuestionController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        
        $questions = $user->questions()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('question_text', 'like', "%{$search}%")
                      ->orWhere('subject', 'like', "%{$search}%");
                });
            })
            ->when($request->subject, function ($query, $subject) {
                $query->where('subject', $subject);
            })
            ->when($request->difficulty, function ($query, $difficulty) {
                $query->where('difficulty', $difficulty);
            })
            ->when($request->status, function ($query, $status) {
                if ($status === 'active') {
                    $query->where('is_active', true);
                } elseif ($status === 'inactive') {
                    $query->where('is_active', false);
                }
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        // Get filter options
        $subjects = $user->questions()
            ->whereNotNull('subject')
            ->distinct()
            ->pluck('subject')
            ->sort()
            ->values();

        return Inertia::render('Questions/Index', [
            'questions' => $questions,
            'subjects' => $subjects,
            'filters' => $request->only(['search', 'subject', 'difficulty', 'status']),
            'stats' => [
                'total' => $user->questions()->count(),
                'active' => $user->questions()->where('is_active', true)->count(),
                'by_difficulty' => $user->questions()
                    ->selectRaw('difficulty, count(*) as count')
                    ->groupBy('difficulty')
                    ->pluck('count', 'difficulty'),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Questions/Create');
    }

    public function store(CreateQuestionRequest $request): RedirectResponse
    {
        $question = $request->user()->questions()->create($request->validated());

        return redirect()->route('questions.index')
            ->with('message', 'Question created successfully!');
    }

    public function show(Question $question): Response
    {
        // Ensure user owns this question
        abort_unless($question->teacher_id === Auth::id(), 403);

        $question->load(['exams' => function($query) {
            $query->with('class')->latest();
        }]);

        return Inertia::render('Questions/Show', [
            'question' => $question,
        ]);
    }

    public function edit(Question $question): Response
    {
        abort_unless($question->teacher_id === Auth::id(), 403);

        return Inertia::render('Questions/Edit', [
            'question' => $question,
        ]);
    }

    public function update(UpdateQuestionRequest $request, Question $question): RedirectResponse
    {
        abort_unless($question->teacher_id === Auth::id(), 403);

        $question->update($request->validated());

        return redirect()->route('questions.index')
            ->with('message', 'Question updated successfully!');
    }

    public function destroy(Question $question): RedirectResponse
    {
        abort_unless($question->teacher_id === Auth::id(), 403);

        // Check if question is used in any exams
        if ($question->exams()->exists()) {
            return back()->withErrors([
                'question' => 'Cannot delete question that is used in exams.'
            ]);
        }

        $question->delete();

        return redirect()->route('questions.index')
            ->with('message', 'Question deleted successfully!');
    }

    public function duplicate(Question $question): RedirectResponse
    {
        abort_unless($question->teacher_id === Auth::id(), 403);

        $newQuestion = $question->replicate();
        $newQuestion->question_text = $question->question_text . ' (Copy)';
        $newQuestion->save();

        return redirect()->route('questions.edit', $newQuestion)
            ->with('message', 'Question duplicated successfully!');
    }

    public function toggleStatus(Question $question): RedirectResponse
    {
        abort_unless($question->teacher_id === Auth::id(), 403);

        $question->update(['is_active' => !$question->is_active]);

        $status = $question->is_active ? 'activated' : 'deactivated';
        
        return back()->with('message', "Question {$status} successfully!");
    }
}