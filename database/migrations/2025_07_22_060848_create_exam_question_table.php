<?php
// database/migrations/2024_01_01_000006_create_exam_question_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exam_question', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->onDelete('cascade');
            $table->foreignId('question_id')->constrained()->onDelete('cascade');
            $table->integer('question_order');
            $table->decimal('points', 5, 2)->default(1.00);
            $table->timestamps();
            
            $table->unique(['exam_id', 'question_id']);
            $table->unique(['exam_id', 'question_order']);
            $table->index('exam_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_question');
    }
};