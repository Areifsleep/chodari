<?php
// app/Http/Controllers/ClassController.php
namespace App\Http\Controllers;

use App\Http\Requests\CreateClassRequest;
use App\Http\Requests\UpdateClassRequest;
use App\Http\Requests\JoinClassRequest;
use App\Models\ClassModel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class ClassController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        
        if ($user->hasRole('teacher')) {
            $classes = $user->teachingClasses()
                ->withCount(['students as students_count' => function($query) {
                    $query->wherePivot('status', 'active');
                }])
                ->withCount('exams')
                ->latest()
                ->paginate(10);
        } else {
            $classes = $user->enrolledClasses()
                ->wherePivot('status', 'active')
                ->with(['teacher', 'exams' => function($query) {
                    $query->where('status', 'published')
                          ->where('start_time', '<=', now())
                          ->where('end_time', '>=', now());
                }])
                ->paginate(10);
        }

        return Inertia::render('Classes/Index', [
            'classes' => $classes,
            'can_create' => $user->hasRole('teacher'),
        ]);
    }

    public function create(): Response
    {
        // No need for authorize() if using middleware
        return Inertia::render('Classes/Create');
    }

    public function store(CreateClassRequest $request): RedirectResponse
    {
        $class = $request->user()->teachingClasses()->create($request->validated());

        return redirect()->route('classes.show', $class)
            ->with('message', 'Class created successfully!');
    }

    public function show(ClassModel $class): Response
    {
        $user = Auth::user();
        
        // Check if user can view this class
        if ($user->hasRole('teacher') && $class->teacher_id !== $user->id) {
            abort(403, 'You can only view your own classes.');
        }
        
        if ($user->hasRole('student') && !$class->students()->where('user_id', $user->id)->exists()) {
            abort(403, 'You are not enrolled in this class.');
        }

        $class->load([
            'teacher',
            'students' => function($query) {
                $query->wherePivot('status', 'active');
            },
            'exams' => function($query) use ($user) {
                if ($user->hasRole('student')) {
                    $query->where('status', 'published');
                }
            }
        ]);

        return Inertia::render('Classes/Show', [
            'class' => $class,
            'can_edit' => $user->hasRole('teacher') && $class->teacher_id === $user->id,
        ]);
    }

    public function edit(ClassModel $class): Response
    {
        // Check ownership
        abort_unless($class->teacher_id === Auth::id(), 403, 'You can only edit your own classes.');

        return Inertia::render('Classes/Edit', [
            'class' => $class,
        ]);
    }

    public function update(UpdateClassRequest $request, ClassModel $class): RedirectResponse
    {
        abort_unless($class->teacher_id === Auth::id(), 403, 'You can only update your own classes.');

        $class->update($request->validated());

        return redirect()->route('classes.show', $class)
            ->with('message', 'Class updated successfully!');
    }

    public function destroy(ClassModel $class): RedirectResponse
    {
        abort_unless($class->teacher_id === Auth::id(), 403, 'You can only delete your own classes.');

        $class->delete();

        return redirect()->route('classes.index')
            ->with('message', 'Class deleted successfully!');
    }

    public function join(JoinClassRequest $request): RedirectResponse
    {
        $class = ClassModel::where('class_code', $request->class_code)
            ->where('is_active', true)
            ->firstOrFail();

        $user = $request->user();

        // Check if already enrolled
        if ($class->students()->where('user_id', $user->id)->exists()) {
            return back()->withErrors(['class_code' => 'You are already enrolled in this class.']);
        }

        // Check class capacity
        if ($class->students()->wherePivot('status', 'active')->count() >= $class->max_students) {
            return back()->withErrors(['class_code' => 'This class is full.']);
        }

        $class->students()->attach($user->id, [
            'status' => 'active',
            'joined_at' => now(),
        ]);

        return redirect()->route('classes.show', $class)
            ->with('message', 'Successfully joined the class!');
    }
}