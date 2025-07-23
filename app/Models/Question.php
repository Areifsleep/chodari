<?php
// app/Models/Question.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'question_text',
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'correct_answer',
        'subject',
        'difficulty',
        'explanation',
        'tags',
        'is_active',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_active' => 'boolean',
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function exams()
    {
        return $this->belongsToMany(Exam::class, 'exam_question')
                    ->withPivot('question_order', 'points')
                    ->withTimestamps();
    }

    public function studentAnswers()
    {
        return $this->hasMany(StudentAnswer::class);
    }
}