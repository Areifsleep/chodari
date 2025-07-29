<?php
// app/Http/Requests/UpdateExamRequest.php
namespace App\Http\Requests;

class UpdateExamRequest extends CreateExamRequest
{
    public function rules(): array
    {
        $rules = parent::rules();
        
        // Allow updating start_time to past for draft exams
        $rules['start_time'] = ['required', 'date'];
        
        return $rules;
    }
}