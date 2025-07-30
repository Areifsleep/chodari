// resources/js/types/index.d.ts
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
    items?: NavItem[];
}

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

export interface ClassModel {
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
    exams?: Exam[];
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
    exams?: Exam[];
    pivot?: {
        question_order: number;
        points: number;
    };
}

export interface Exam {
    id: number;
    title: string;
    description?: string;
    teacher_id: number;
    teacher?: User;
    class_id: number;
    class?: ClassModel;
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
    questions?: Question[];
    attempts?: ExamAttempt[];
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
    answers?: StudentAnswer[];
}

export interface StudentAnswer {
    id: number;
    attempt_id: number;
    attempt?: ExamAttempt;
    question_id: number;
    question?: Question;
    selected_answer?: 'a' | 'b' | 'c' | 'd';
    is_correct?: boolean;
    points_earned: number;
    time_spent_seconds?: number;
    answered_at?: string;
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

export interface PageProps<T extends Record<string, unknown> = Record<string, unknown>> {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
    flash?: {
        message?: string;
        type?: 'success' | 'error' | 'warning' | 'info';
    };
}

// Utility types for pagination
export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        path: string;
    };
}

export interface PaginationLink {
    url?: string;
    label: string;
    active: boolean;
}

// Form data interfaces
export interface CreateClassFormData {
    name: string;
    description?: string;
    subject?: string;
    grade_level?: 'elementary' | 'middle' | 'high';
    max_students?: number;
}

export interface CreateQuestionFormData {
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
}

export interface CreateExamFormData {
    title: string;
    description?: string;
    class_id: string;
    duration_minutes: number;
    start_time: string;
    end_time: string;
    shuffle_questions: boolean;
    show_results_immediately: boolean;
    allow_review: boolean;
    passing_score: number;
    max_attempts: number;
    selected_questions: { id: number; points: number; order: number }[];
}

// Filter interfaces
export interface ExamFilters {
    search?: string;
    class_id?: string;
    status?: string;
}

export interface QuestionFilters {
    search?: string;
    subject?: string;
    difficulty?: string;
    status?: string;
}

export interface ClassFilters {
    search?: string;
    subject?: string;
    grade_level?: string;
    status?: string;
}
