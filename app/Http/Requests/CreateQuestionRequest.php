<?php
// app/Http/Requests/CreateQuestionRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('teacher');
    }

    public function rules(): array
    {
        return [
            'question_text' => ['required', 'string', 'min:10', 'max:1000'],
            'option_a' => ['required', 'string', 'max:255'],
            'option_b' => ['required', 'string', 'max:255'],
            'option_c' => ['required', 'string', 'max:255'],
            'option_d' => ['required', 'string', 'max:255'],
            'correct_answer' => ['required', 'in:a,b,c,d'],
            'subject' => ['nullable', 'string', 'max:100'],
            'difficulty' => ['required', 'in:easy,medium,hard'],
            'explanation' => ['nullable', 'string', 'max:500'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'question_text.min' => 'Question must be at least 10 characters long.',
            'correct_answer.in' => 'Please select a valid correct answer option.',
        ];
    }

    protected function prepareForValidation(): void
    {
        // Clean up tags array
        if ($this->has('tags') && is_string($this->tags)) {
            $this->merge([
                'tags' => array_filter(array_map('trim', explode(',', $this->tags)))
            ]);
        }
    }
}