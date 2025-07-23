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

// resources/js/types/index.ts
export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    bio?: string;
    avatar?: string;
    is_active: boolean;
    roles: Role[];
    permissions: Permission[];
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export interface Class {
    id: number;
    name: string;
    description?: string;
    teacher_id: number;
    teacher?: User;
    class_code: string;
    subject?: string;
    grade_level?: 'elementary' | 'middle' | 'high';
    max_students: number;
    is_active: boolean;
    students_count?: number;
    exams_count?: number;
    created_at: string;
    updated_at: string;
    students?: User[];
}

export interface Question {
    id: number;
    teacher_id: number;
    teacher?: User;
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
    teacher?: User;
    class_id: number;
    class?: Class;
    duration_minutes: number;
    start_time: string;
    end_time: string;
    shuffle_questions: boolean;
    show_results_immediately: boolean;
    allow_review: boolean;
    passing_score: number;
    max_attempts: number;
    status: 'draft' | 'published' | 'completed' | 'archived';
    questions_count?: number;
    attempts_count?: number;
    created_at: string;
    updated_at: string;
}

export interface ExamAttempt {
    id: number;
    exam_id: number;
    exam?: Exam;
    student_id: number;
    student?: User;
    attempt_number: number;
    started_at?: string;
    completed_at?: string;
    submitted_at?: string;
    score?: number;
    percentage?: number;
    total_questions: number;
    correct_answers: number;
    incorrect_answers: number;
    unanswered_questions: number;
    status: 'not_started' | 'in_progress' | 'submitted' | 'completed' | 'expired';
    metadata?: any;
    created_at: string;
    updated_at: string;
}

export interface DashboardStats {
    classes_count?: number;
    questions_count?: number;
    exams_count?: number;
    completed_exams?: number;
    average_score?: number;
}

export interface BreadcrumbItem {
    title: string;
    href?: string;
    current?: boolean;
}

export interface PageProps {
    auth: {
        user: User;
    };
    flash?: {
        message?: string;
        type?: 'success' | 'error' | 'warning' | 'info';
    };
}

export interface DashboardProps extends PageProps {
    user: User;
    stats?: DashboardStats;
    recent_classes?: Class[];
    recent_exams?: ExamAttempt[];
}
