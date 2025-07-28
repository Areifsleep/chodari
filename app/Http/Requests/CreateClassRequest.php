<?php
// app/Http/Requests/CreateClassRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class CreateClassRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::user()->hasRole('teacher');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'subject' => ['nullable', 'string', 'max:100'],
            'grade_level' => ['nullable', 'in:elementary,middle,high'],
            'max_students' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}