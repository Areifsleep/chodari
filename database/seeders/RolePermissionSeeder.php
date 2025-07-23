<?php
// database/seeders/RolePermissionSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Create permissions
        $permissions = [
            // Class permissions
            'create-classes',
            'view-classes',
            'edit-classes',
            'delete-classes',
            'manage-class-students',
            
            // Question permissions
            'create-questions',
            'view-questions',
            'edit-questions',
            'delete-questions',
            'import-questions',
            'export-questions',
            
            // Exam permissions
            'create-exams',
            'view-exams',
            'edit-exams',
            'delete-exams',
            'grade-exams',
            'view-exam-results',
            
            // Student permissions
            'join-classes',
            'take-exams',
            'view-own-results',
            
            // Admin permissions
            'manage-users',
            'view-system-reports',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        $teacherRole = Role::firstOrCreate(['name' => 'teacher']);
        $studentRole = Role::firstOrCreate(['name' => 'student']);
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        // Teacher permissions
        $teacherPermissions = [
            'create-classes', 'view-classes', 'edit-classes', 'delete-classes', 'manage-class-students',
            'create-questions', 'view-questions', 'edit-questions', 'delete-questions', 'import-questions', 'export-questions',
            'create-exams', 'view-exams', 'edit-exams', 'delete-exams', 'grade-exams', 'view-exam-results'
        ];
        $teacherRole->syncPermissions($teacherPermissions);

        // Student permissions
        $studentPermissions = [
            'join-classes', 'take-exams', 'view-own-results'
        ];
        $studentRole->syncPermissions($studentPermissions);

        // Admin permissions (all permissions)
        $adminRole->syncPermissions(Permission::all());
    }
}