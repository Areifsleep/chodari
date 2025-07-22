<?php
// database/migrations/2024_01_01_000008_create_student_answers_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attempt_id')->constrained('exam_attempts')->onDelete('cascade');
            $table->foreignId('question_id')->constrained()->onDelete('cascade');
            $table->enum('selected_answer', ['a', 'b', 'c', 'd'])->nullable();
            $table->boolean('is_correct')->nullable();
            $table->decimal('points_earned', 5, 2)->default(0);
            $table->integer('time_taken_seconds')->nullable(); // Time taken for this question
            $table->timestamp('answered_at')->nullable();
            $table->timestamps();
            
            $table->unique(['attempt_id', 'question_id']);
            $table->index(['attempt_id', 'is_correct']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_answers');
    }
};