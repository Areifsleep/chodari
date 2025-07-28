<?php
// app/Models/StudentAnswer.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $attempt_id
 * @property int $question_id
 * @property string|null $selected_answer
 * @property bool|null $is_correct
 * @property numeric $points_earned
 * @property int|null $time_taken_seconds
 * @property \Illuminate\Support\Carbon|null $answered_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\ExamAttempt $attempt
 * @property-read \App\Models\Question $question
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudentAnswer newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudentAnswer newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudentAnswer query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudentAnswer whereAnsweredAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudentAnswer whereAttemptId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudentAnswer whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudentAnswer whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudentAnswer whereIsCorrect($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudentAnswer wherePointsEarned($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudentAnswer whereQuestionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudentAnswer whereSelectedAnswer($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudentAnswer whereTimeTakenSeconds($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudentAnswer whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class StudentAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'attempt_id',
        'question_id',
        'selected_answer',
        'is_correct',
        'points_earned',
        'time_spent_seconds',
        'answered_at',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
        'points_earned' => 'decimal:2',
        'time_spent_seconds' => 'integer',
        'answered_at' => 'datetime',
    ];

    public function attempt()
    {
        return $this->belongsTo(ExamAttempt::class, 'attempt_id');
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}