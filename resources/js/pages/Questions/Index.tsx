// resources/js/Pages/Questions/Index.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { PageProps, Question } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Copy, Edit, Eye, FileQuestion, Plus, Search, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface QuestionsIndexProps extends PageProps {
    questions: {
        data: Question[];
        links: any[];
        meta: any;
    };
    subjects: string[];
    filters: {
        search?: string;
        subject?: string;
        difficulty?: string;
        status?: string;
    };
    stats: {
        total: number;
        active: number;
        by_difficulty: Record<string, number>;
    };
}

export default function QuestionsIndex({ questions, subjects, filters, stats }: QuestionsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedFilters, setSelectedFilters] = useState({
        subject: filters.subject || 'all', // ← Changed from '' to 'all'
        difficulty: filters.difficulty || 'all', // ← Changed from '' to 'all'
        status: filters.status || 'all', // ← Changed from '' to 'all'
    });

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Questions', href: '/questions' },
    ];

    const handleSearch = () => {
        // Convert 'all' back to empty string for API
        const apiFilters = {
            subject: selectedFilters.subject === 'all' ? '' : selectedFilters.subject,
            difficulty: selectedFilters.difficulty === 'all' ? '' : selectedFilters.difficulty,
            status: selectedFilters.status === 'all' ? '' : selectedFilters.status,
        };

        router.get(
            '/questions',
            {
                search,
                ...apiFilters,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...selectedFilters, [key]: value };
        setSelectedFilters(newFilters);

        // Convert 'all' back to empty string for API
        const apiFilters = {
            subject: newFilters.subject === 'all' ? '' : newFilters.subject,
            difficulty: newFilters.difficulty === 'all' ? '' : newFilters.difficulty,
            status: newFilters.status === 'all' ? '' : newFilters.status,
        };

        router.get(
            '/questions',
            {
                search,
                ...apiFilters,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedFilters({ subject: 'all', difficulty: 'all', status: 'all' });
        router.get('/questions', {}, { preserveState: true, replace: true });
    };

    const toggleQuestionStatus = (questionId: number) => {
        router.post(
            `/questions/${questionId}/toggle-status`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const duplicateQuestion = (questionId: number) => {
        router.post(`/questions/${questionId}/duplicate`);
    };

    const deleteQuestion = (questionId: number) => {
        if (confirm('Are you sure you want to delete this question?')) {
            router.delete(`/questions/${questionId}`);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return 'bg-green-100 text-green-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'hard':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Question Bank" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Question Bank</h1>
                        <p className="text-muted-foreground">Manage your exam questions and build your question library</p>
                    </div>
                    <Link href="/questions/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Question
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                            <FileQuestion className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active</CardTitle>
                            <ToggleRight className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Easy</CardTitle>
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.by_difficulty.easy || 0}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Hard</CardTitle>
                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.by_difficulty.hard || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                            <div className="md:col-span-2">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                    <Input
                                        placeholder="Search questions..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Subject Filter - Fixed */}
                            <Select value={selectedFilters.subject} onValueChange={(value) => handleFilterChange('subject', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Subjects" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Subjects</SelectItem>
                                    {subjects.map((subject) => (
                                        <SelectItem key={subject} value={subject}>
                                            {subject}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Difficulty Filter - Fixed */}
                            <Select value={selectedFilters.difficulty} onValueChange={(value) => handleFilterChange('difficulty', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Difficulties" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Difficulties</SelectItem>
                                    <SelectItem value="easy">Easy</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Status Filter - Fixed */}
                            <Select value={selectedFilters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active Only</SelectItem>
                                    <SelectItem value="inactive">Inactive Only</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleSearch} className="flex-1">
                                    <Search className="mr-2 h-4 w-4" />
                                    Search
                                </Button>
                                <Button variant="ghost" onClick={clearFilters}>
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Questions List */}
                {questions.data.length > 0 ? (
                    <div className="space-y-4">
                        {questions.data.map((question) => (
                            <Card key={question.id} className="transition-shadow hover:shadow-md">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="mb-3 flex items-start justify-between">
                                                <h3 className="text-lg leading-tight font-medium">{question.question_text}</h3>
                                                <div className="ml-4 flex flex-shrink-0 items-center gap-2">
                                                    <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                                                    {question.subject && <Badge variant="outline">{question.subject}</Badge>}
                                                    <Badge variant={question.is_active ? 'default' : 'secondary'}>
                                                        {question.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-green-600">A:</span>
                                                    <span className={question.correct_answer === 'a' ? 'font-medium text-green-600' : ''}>
                                                        {question.option_a}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-blue-600">B:</span>
                                                    <span className={question.correct_answer === 'b' ? 'font-medium text-green-600' : ''}>
                                                        {question.option_b}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-orange-600">C:</span>
                                                    <span className={question.correct_answer === 'c' ? 'font-medium text-green-600' : ''}>
                                                        {question.option_c}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-purple-600">D:</span>
                                                    <span className={question.correct_answer === 'd' ? 'font-medium text-green-600' : ''}>
                                                        {question.option_d}
                                                    </span>
                                                </div>
                                            </div>

                                            {question.tags && question.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {question.tags.map((tag, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-shrink-0 flex-col gap-2">
                                            <Link href={`/questions/${question.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/questions/${question.id}/edit`}>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="sm" onClick={() => duplicateQuestion(question.id)}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => toggleQuestionStatus(question.id)}>
                                                {question.is_active ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => deleteQuestion(question.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <FileQuestion className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">No questions found</h3>
                            <p className="mb-4 text-muted-foreground">
                                {selectedFilters.subject !== 'all' ||
                                selectedFilters.difficulty !== 'all' ||
                                selectedFilters.status !== 'all' ||
                                search
                                    ? 'No questions match your current filters'
                                    : 'Start building your question bank'}
                            </p>
                            {!(
                                selectedFilters.subject !== 'all' ||
                                selectedFilters.difficulty !== 'all' ||
                                selectedFilters.status !== 'all' ||
                                search
                            ) ? (
                                <Link href="/questions/create">
                                    <Button>Create Your First Question</Button>
                                </Link>
                            ) : (
                                <Button variant="outline" onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
