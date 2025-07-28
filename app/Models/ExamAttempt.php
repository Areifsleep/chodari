<?php
// app/Models/ExamAttempt.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $exam_id
 * @property int $student_id
 * @property int $attempt_number
 * @property \Illuminate\Support\Carbon|null $started_at
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property \Illuminate\Support\Carbon|null $submitted_at
 * @property numeric|null $score
 * @property numeric|null $percentage
 * @property int $total_questions
 * @property int $correct_answers
 * @property int $wrong_answers
 * @property int $unanswered
 * @property string $status
 * @property array<array-key, mixed>|null $metadata
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StudentAnswer> $answers
 * @property-read int|null $answers_count
 * @property-read \App\Models\Exam $exam
 * @property-read \App\Models\User $student
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamAttempt newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamAttempt newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamAttempt query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamAttempt whereAttemptNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamAttempt whereCompletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamAttempt whereCorrectAnswers($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamAttempt whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamAttempt whereExamId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamAttempt whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamAttempt whereMetadata($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamAttempt wherePercentage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamAttempt whereScore($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamAttempt whereStartedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamAttempt whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamAttempt whereStudentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamAttempt whereSubmittedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamAttempt whereTotalQuestions($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamAttempt whereUnanswered($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamAttempt whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamAttempt whereWrongAnswers($value)
 * @mixin \Eloquent
 */
class ExamAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_id',
        'student_id',
        'attempt_number',
        'started_at',
        'completed_at',
        'submitted_at',
        'score',
        'percentage',
        'total_questions',
        'correct_answers',
        'incorrect_answers',
        'unanswered_questions',
        'status',
        'metadata',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'submitted_at' => 'datetime',
        'score' => 'decimal:2',
        'percentage' => 'decimal:2',
        'metadata' => 'array',
        'total_questions' => 'integer',
        'correct_answers' => 'integer',
        'incorrect_answers' => 'integer',
        'unanswered_questions' => 'integer',
        'attempt_number' => 'integer',
    ];

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function answers()
    {
        return $this->hasMany(StudentAnswer::class, 'attempt_id');
    }

    public function isInProgress(): bool
    {
        return $this->status === 'in_progress';
    }

    public function isCompleted(): bool
    {
        return in_array($this->status, ['submitted', 'completed']);
    }
}