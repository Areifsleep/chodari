<?php
// database/migrations/2024_01_01_000002_create_classes_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->string('class_code', 10)->unique();
            $table->string('subject')->nullable();
            $table->enum('status', ['active', 'inactive', 'archived'])->default('active');
            $table->integer('max_students')->default(50);
            $table->timestamps();
            
            $table->index(['teacher_id', 'status']);
            $table->index('class_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};