<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
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
	class ClassModel extends \Eloquent {}
}

namespace App\Models{
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
	class Exam extends \Eloquent {}
}

namespace App\Models{
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
	class ExamAttempt extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $teacher_id
 * @property string $question_text
 * @property string $option_a
 * @property string $option_b
 * @property string $option_c
 * @property string $option_d
 * @property string $correct_answer
 * @property string|null $subject
 * @property string $difficulty
 * @property string|null $explanation
 * @property array<array-key, mixed>|null $tags
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Exam> $exams
 * @property-read int|null $exams_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StudentAnswer> $studentAnswers
 * @property-read int|null $student_answers_count
 * @property-read \App\Models\User $teacher
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Question newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Question newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Question query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Question whereCorrectAnswer($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Question whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Question whereDifficulty($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Question whereExplanation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Question whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Question whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Question whereOptionA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Question whereOptionB($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Question whereOptionC($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Question whereOptionD($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Question whereQuestionText($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Question whereSubject($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Question whereTags($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Question whereTeacherId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Question whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	class Question extends \Eloquent {}
}

namespace App\Models{
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
	class StudentAnswer extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string|null $avatar
 * @property bool $is_active
 * @property string $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Exam> $createdExams
 * @property-read int|null $created_exams_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ClassModel> $enrolledClasses
 * @property-read int|null $enrolled_classes_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ExamAttempt> $examAttempts
 * @property-read int|null $exam_attempts_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Permission\Models\Permission> $permissions
 * @property-read int|null $permissions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Question> $questions
 * @property-read int|null $questions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Permission\Models\Role> $roles
 * @property-read int|null $roles_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ClassModel> $teachingClasses
 * @property-read int|null $teaching_classes_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User permission($permissions, $without = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User role($roles, $guard = null, $without = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereAvatar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withoutPermission($permissions)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withoutRole($roles, $guard = null)
 * @mixin \Eloquent
 */
	class User extends \Eloquent {}
}

