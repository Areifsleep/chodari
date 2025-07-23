<?php
// database/seeders/UserSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $admin->assignRole('admin');

        // Create teacher user
        $teacher = User::create([
            'name' => 'John Teacher',
            'email' => 'teacher@example.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $teacher->assignRole('teacher');

        // Create student users
        $student1 = User::create([
            'name' => 'Jane Student',
            'email' => 'student1@example.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $student1->assignRole('student');

        $student2 = User::create([
            'name' => 'Bob Student',
            'email' => 'student2@example.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $student2->assignRole('student');
    }
}