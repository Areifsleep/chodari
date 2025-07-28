<?php
// app/Http/Requests/JoinClassRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class JoinClassRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::user()->hasRole('student');
    }

    public function rules(): array
    {
        return [
            'class_code' => ['required', 'string', 'size:6', 'exists:classes,class_code'],
        ];
    }

    public function messages(): array
    {
        return [
            'class_code.exists' => 'Invalid class code. Please check and try again.',
        ];
    }
}