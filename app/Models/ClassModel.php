<?php
// app/Models/ClassModel.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

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
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
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
}