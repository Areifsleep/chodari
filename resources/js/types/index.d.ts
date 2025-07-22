import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    is_active: boolean;
    roles: Role[];
    permissions: Permission[];
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions: Permission[];
}

export interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

export interface Class {
    id: number;
    name: string;
    description?: string;
    teacher_id: number;
    teacher: User;
    class_code: string;
    subject?: string;
    status: 'active' | 'inactive' | 'archived';
    max_students: number;
    students?: User[];
    students_count?: number;
    exams?: Exam[];
    created_at: string;
    updated_at: string;
}

export interface Question {
    id: number;
    teacher_id: number;
    teacher: User;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: 'a' | 'b' | 'c' | 'd';
    subject?: string;
    difficulty: 'easy' | 'medium' | 'hard';
    explanation?: string;
    tags?: string[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Exam {
    id: number;
    title: string;
    description?: string;
    teacher_id: number;
    teacher: User;
    class_id: number;
    class: Class;
    duration_minutes: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
    shuffle_questions: boolean;
    show_results_immediately: boolean;
    max_attempts: number;
    passing_score?: number;
    settings?: Record<string, any>;
    questions?: Question[];
    questions_count?: number;
    attempts?: ExamAttempt[];
    created_at: string;
    updated_at: string;
}

export interface ExamAttempt {
    id: number;
    exam_id: number;
    exam: Exam;
    student_id: number;
    student: User;
    attempt_number: number;
    started_at?: string;
    completed_at?: string;
    submitted_at?: string;
    score?: number;
    percentage?: number;
    total_questions: number;
    correct_answers: number;
    wrong_answers: number;
    unanswered: number;
    status: 'not_started' | 'in_progress' | 'completed' | 'submitted' | 'timed_out';
    metadata?: Record<string, any>;
    answers?: StudentAnswer[];
    created_at: string;
    updated_at: string;
}

export interface StudentAnswer {
    id: number;
    attempt_id: number;
    question_id: number;
    question: Question;
    selected_answer?: 'a' | 'b' | 'c' | 'd';
    is_correct?: boolean;
    points_earned: number;
    time_taken_seconds?: number;
    answered_at?: string;
    created_at: string;
    updated_at: string;
}

export interface PageProps {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };
}
