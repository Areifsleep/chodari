<?php
// app/Http/Requests/UpdateClassRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClassRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('teacher');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'subject' => ['nullable', 'string', 'max:100'],
            'grade_level' => ['nullable', 'in:elementary,middle,high'],
            'max_students' => ['required', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'max_students.min' => 'Maximum students must be at least 1.',
            'max_students.required' => 'Maximum students field is required.',
        ];
    }

    protected function prepareForValidation(): void
    {
        // Ensure grade_level is null if empty string
        if ($this->grade_level === '') {
            $this->merge(['grade_level' => null]);
        }
        
        // Ensure subject is null if empty string
        if ($this->subject === '') {
            $this->merge(['subject' => null]);
        }
    }
}