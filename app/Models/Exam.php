<?php
// app/Models/Exam.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $title
 * @property string|null $description
 * @property int $teacher_id
 * @property int $class_id
 * @property int $duration_minutes
 * @property \Illuminate\Support\Carbon $start_time
 * @property \Illuminate\Support\Carbon $end_time
 * @property int $is_active
 * @property bool $shuffle_questions
 * @property bool $show_results_immediately
 * @property int $max_attempts
 * @property numeric|null $passing_score
 * @property string|null $settings
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ExamAttempt> $attempts
 * @property-read int|null $attempts_count
 * @property-read \App\Models\ClassModel $class
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Question> $questions
 * @property-read int|null $questions_count
 * @property-read \App\Models\User $teacher
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereClassId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereDurationMinutes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereEndTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereMaxAttempts($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam wherePassingScore($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereSettings($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereShowResultsImmediately($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereShuffleQuestions($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereStartTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereTeacherId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Exam whereUpdatedAt($value)
 * @mixin \Eloquent
 */
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