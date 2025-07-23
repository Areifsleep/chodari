<?php
// app/Models/Exam.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'teacher_id',
        'class_id',
        'duration_minutes',
        'start_time',
        'end_time',
        'shuffle_questions',
        'show_results_immediately',
        'allow_review',
        'passing_score',
        'max_attempts',
        'status',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'shuffle_questions' => 'boolean',
        'show_results_immediately' => 'boolean',
        'allow_review' => 'boolean',
        'passing_score' => 'decimal:2',
        'duration_minutes' => 'integer',
        'max_attempts' => 'integer',
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function class()
    {
        return $this->belongsTo(ClassModel::class, 'class_id');
    }

    public function questions()
    {
        return $this->belongsToMany(Question::class, 'exam_question')
                    ->withPivot('question_order', 'points')
                    ->withTimestamps()
                    ->orderBy('exam_question.question_order');
    }

    public function attempts()
    {
        return $this->hasMany(ExamAttempt::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'published' && 
               now()->between($this->start_time, $this->end_time);
    }

    public function canBeTaken(): bool
    {
        return $this->isActive() && $this->status === 'published';
    }
}