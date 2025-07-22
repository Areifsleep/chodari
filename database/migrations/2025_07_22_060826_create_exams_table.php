<?php
// database/migrations/2024_01_01_000005_create_exams_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('class_id')->constrained()->onDelete('cascade');
            $table->integer('duration_minutes');
            $table->datetime('start_time');
            $table->datetime('end_time');
            $table->boolean('is_active')->default(true);
            $table->boolean('shuffle_questions')->default(false);
            $table->boolean('show_results_immediately')->default(true);
            $table->integer('max_attempts')->default(1);
            $table->decimal('passing_score', 5, 2)->nullable();
            $table->json('settings')->nullable(); // Additional exam settings
            $table->timestamps();
            
            $table->index(['class_id', 'is_active']);
            $table->index(['teacher_id', 'start_time']);
            $table->index(['start_time', 'end_time']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};