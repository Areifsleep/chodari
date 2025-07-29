<?php
// app/Http/Requests/CreateExamRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class CreateExamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('teacher');
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'class_id' => ['required', 'exists:classes,id'],
            'duration_minutes' => ['required', 'integer', 'min:5', 'max:480'],
            'start_time' => ['required', 'date', 'after:now'],
            'end_time' => ['required', 'date', 'after:start_time'],
            'shuffle_questions' => ['nullable', 'boolean'],
            'show_results_immediately' => ['nullable', 'boolean'],
            'allow_review' => ['nullable', 'boolean'],
            'passing_score' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'max_attempts' => ['nullable', 'integer', 'min:1', 'max:10'],
            'status' => ['nullable', 'in:draft,published'],
            'selected_questions' => ['nullable', 'array'],
            'selected_questions.*.id' => ['required', 'exists:questions,id'],
            'selected_questions.*.points' => ['nullable', 'numeric', 'min:0.1', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'class_id.required' => 'Please select a class for this exam.',
            'start_time.after' => 'Exam start time must be in the future.',
            'end_time.after' => 'Exam end time must be after start time.',
            'duration_minutes.min' => 'Exam duration must be at least 5 minutes.',
            'duration_minutes.max' => 'Exam duration cannot exceed 8 hours.',
        ];
    }

    protected function prepareForValidation(): void
    {
        // Ensure the selected class belongs to the authenticated user
        if ($this->has('class_id')) {
            $classExists = Auth::user()->teachingClasses()
                ->where('id', $this->class_id)
                ->exists();
                
            if (!$classExists) {
                $this->merge(['class_id' => null]);
            }
        }
    }
}