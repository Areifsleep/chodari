<?php
// app/Models/ClassModel.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property int $teacher_id
 * @property string $class_code
 * @property string|null $subject
 * @property string $status
 * @property int $max_students
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Exam> $exams
 * @property-read int|null $exams_count
 * @property-read int|null $students_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $students
 * @property-read \App\Models\User $teacher
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClassModel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClassModel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClassModel query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClassModel whereClassCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClassModel whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClassModel whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClassModel whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClassModel whereMaxStudents($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClassModel whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClassModel whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClassModel whereSubject($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClassModel whereTeacherId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClassModel whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class ClassModel extends Model
{
    use HasFactory;

    protected $table = 'classes';

    protected $fillable = [
        'name',
        'description',
        'teacher_id',
        'class_code',
        'subject',
        'grade_level',
        'max_students',
        'status',
    ];

    protected $casts = [
    
        'max_students' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($class) {
            if (empty($class->class_code)) {
                $class->class_code = static::generateUniqueClassCode();
            }
        });
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'class_user', 'class_id', 'user_id')
                    ->withPivot('status', 'joined_at', 'left_at')
                    ->withTimestamps();
    }

    public function exams()
    {
        return $this->hasMany(Exam::class, 'class_id');
    }

    public static function generateUniqueClassCode(): string
    {
        do {
            $code = strtoupper(Str::random(6));
        } while (static::where('class_code', $code)->exists());

        return $code;
    }

    public function getStudentsCountAttribute()
    {
        return $this->students()->wherePivot('status', 'active')->count();
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isInactive(): bool
    {
        return $this->status === 'inactive';
    }

    public function isArchived(): bool
    {
        return $this->status === 'archived';
    }
}