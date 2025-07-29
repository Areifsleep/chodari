// resources/js/Pages/Exams/Create.tsx
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { ClassModel, PageProps, Question } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Clock, FileQuestion, Minus, Plus, Save } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface CreateExamProps extends PageProps {
    classes: ClassModel[];
    questions: {
        data: Question[];
        links: any[];
        meta: any;
    };
    subjects: string[];
}

export default function CreateExam({ classes, questions, subjects }: CreateExamProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        class_id: '',
        duration_minutes: 60,
        start_time: '',
        end_time: '',
        shuffle_questions: false as boolean,
        show_results_immediately: true as boolean,
        allow_review: true as boolean,
        passing_score: 60,
        max_attempts: 1,
        selected_questions: [] as { id: number; points: number; order: number }[],
    });

    const [questionFilters, setQuestionFilters] = useState({
        search: '',
        subject: 'all',
        difficulty: 'all',
    });

    const [showQuestionBank, setShowQuestionBank] = useState(false);

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Exams', href: '/exams' },
        { title: 'Create Exam', href: '' },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('exams.store'));
    };

    const addQuestion = (question: Question) => {
        const nextOrder = Math.max(...data.selected_questions.map((q) => q.order), 0) + 1;
        setData('selected_questions', [...data.selected_questions, { id: question.id, points: 1, order: nextOrder }]);
    };

    const removeQuestion = (questionId: number) => {
        setData(
            'selected_questions',
            data.selected_questions.filter((q) => q.id !== questionId),
        );
    };

    const updateQuestionPoints = (questionId: number, points: number) => {
        setData(
            'selected_questions',
            data.selected_questions.map((q) => (q.id === questionId ? { ...q, points } : q)),
        );
    };

    const moveQuestion = (questionId: number, direction: 'up' | 'down') => {
        const questions = [...data.selected_questions];
        const index = questions.findIndex((q) => q.id === questionId);

        if (direction === 'up' && index > 0) {
            [questions[index], questions[index - 1]] = [questions[index - 1], questions[index]];
        } else if (direction === 'down' && index < questions.length - 1) {
            [questions[index], questions[index + 1]] = [questions[index + 1], questions[index]];
        }

        // Update order numbers
        questions.forEach((q, i) => (q.order = i + 1));
        setData('selected_questions', questions);
    };

    const filteredQuestions = questions.data.filter((question) => {
        const matchesSearch = questionFilters.search === '' || question.question_text.toLowerCase().includes(questionFilters.search.toLowerCase());
        const matchesSubject = questionFilters.subject === 'all' || question.subject === questionFilters.subject;
        const matchesDifficulty = questionFilters.difficulty === 'all' || question.difficulty === questionFilters.difficulty;
        const notAlreadySelected = !data.selected_questions.some((sq) => sq.id === question.id);

        return matchesSearch && matchesSubject && matchesDifficulty && notAlreadySelected;
    });

    const selectedQuestionsWithDetails = data.selected_questions
        .map((sq) => ({
            ...sq,
            question: questions.data.find((q) => q.id === sq.id),
        }))
        .filter((sq) => sq.question);

    const totalPoints = data.selected_questions.reduce((sum, q) => sum + q.points, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Exam" />

            <div className="mx-auto max-w-6xl space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/exams">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Exams
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Create New Exam</h1>
                        <p className="text-muted-foreground">Set up a new exam for your students</p>
                    </div>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column - Exam Details */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>Enter the exam title, description, and target class</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Exam Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g., Mathematics Midterm Exam"
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Brief description of the exam content..."
                                        rows={3}
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="class_id">Target Class *</Label>
                                    <Select value={data.class_id} onValueChange={(value) => setData('class_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes.map((classItem) => (
                                                <SelectItem key={classItem.id} value={classItem.id.toString()}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{classItem.name}</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {classItem.students_count} students
                                                        </Badge>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.class_id} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timing Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Timing & Schedule
                                </CardTitle>
                                <CardDescription>Set the exam duration and availability window</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="duration_minutes">Duration (minutes) *</Label>
                                        <Input
                                            id="duration_minutes"
                                            type="number"
                                            min="1"
                                            max="300"
                                            value={data.duration_minutes}
                                            onChange={(e) => setData('duration_minutes', parseInt(e.target.value))}
                                        />
                                        <InputError message={errors.duration_minutes} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="start_time">Start Time *</Label>
                                        <Input
                                            id="start_time"
                                            type="datetime-local"
                                            value={data.start_time}
                                            onChange={(e) => setData('start_time', e.target.value)}
                                        />
                                        <InputError message={errors.start_time} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="end_time">End Time *</Label>
                                        <Input
                                            id="end_time"
                                            type="datetime-local"
                                            value={data.end_time}
                                            onChange={(e) => setData('end_time', e.target.value)}
                                        />
                                        <InputError message={errors.end_time} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Question Selection */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileQuestion className="h-5 w-5" />
                                            Questions ({data.selected_questions.length})
                                        </CardTitle>
                                        <CardDescription>Select questions for this exam • Total Points: {totalPoints}</CardDescription>
                                    </div>
                                    <Button type="button" variant="outline" onClick={() => setShowQuestionBank(!showQuestionBank)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Questions
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Question Bank Selector */}
                                {showQuestionBank && (
                                    <div className="mb-6 space-y-4 rounded-lg border p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <Input
                                                    placeholder="Search questions..."
                                                    value={questionFilters.search}
                                                    onChange={(e) => setQuestionFilters((prev) => ({ ...prev, search: e.target.value }))}
                                                />
                                            </div>
                                            <Select
                                                value={questionFilters.subject}
                                                onValueChange={(value) => setQuestionFilters((prev) => ({ ...prev, subject: value }))}
                                            >
                                                <SelectTrigger className="w-40">
                                                    <SelectValue />
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
                                            <Select
                                                value={questionFilters.difficulty}
                                                onValueChange={(value) => setQuestionFilters((prev) => ({ ...prev, difficulty: value }))}
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Levels</SelectItem>
                                                    <SelectItem value="easy">Easy</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="hard">Hard</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="max-h-60 space-y-2 overflow-y-auto">
                                            {filteredQuestions.map((question) => (
                                                <div key={question.id} className="flex items-start justify-between rounded border p-3">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">{question.question_text}</p>
                                                        <div className="mt-1 flex items-center gap-2">
                                                            <Badge variant="outline" className="text-xs">
                                                                {question.difficulty}
                                                            </Badge>
                                                            {question.subject && (
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {question.subject}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button type="button" size="sm" onClick={() => addQuestion(question)}>
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Selected Questions */}
                                <div className="space-y-3">
                                    {selectedQuestionsWithDetails.length > 0 ? (
                                        selectedQuestionsWithDetails
                                            .sort((a, b) => a.order - b.order)
                                            .map((item, index) => (
                                                <div key={item.id} className="flex items-start gap-4 rounded-lg border p-4">
                                                    <div className="flex flex-col gap-1">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => moveQuestion(item.id, 'up')}
                                                            disabled={index === 0}
                                                        >
                                                            ↑
                                                        </Button>
                                                        <span className="text-center font-mono text-sm">{item.order}</span>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => moveQuestion(item.id, 'down')}
                                                            disabled={index === selectedQuestionsWithDetails.length - 1}
                                                        >
                                                            ↓
                                                        </Button>
                                                    </div>

                                                    <div className="flex-1">
                                                        <p className="font-medium">{item.question?.question_text}</p>
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <Badge variant="outline">{item.question?.difficulty}</Badge>
                                                            {item.question?.subject && <Badge variant="secondary">{item.question.subject}</Badge>}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Label htmlFor={`points-${item.id}`} className="text-sm">
                                                            Points:
                                                        </Label>
                                                        <Input
                                                            id={`points-${item.id}`}
                                                            type="number"
                                                            min="0.5"
                                                            max="10"
                                                            step="0.5"
                                                            value={item.points}
                                                            onChange={(e) => updateQuestionPoints(item.id, parseFloat(e.target.value))}
                                                            className="w-20"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeQuestion(item.id)}
                                                            className="text-red-600"
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                    ) : (
                                        <div className="py-8 text-center text-muted-foreground">
                                            <FileQuestion className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                            <p>No questions selected yet</p>
                                            <p className="text-sm">Click "Add Questions" to start building your exam</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Settings & Summary */}
                    <div className="space-y-6">
                        {/* Exam Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Exam Settings</CardTitle>
                                <CardDescription>Configure exam behavior and scoring</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="shuffle_questions">Shuffle Questions</Label>
                                            <p className="text-xs text-muted-foreground">Randomize question order for each student</p>
                                        </div>
                                        <Switch
                                            id="shuffle_questions"
                                            checked={data.shuffle_questions}
                                            onCheckedChange={(checked) => setData('shuffle_questions', checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="show_results_immediately">Show Results Immediately</Label>
                                            <p className="text-xs text-muted-foreground">Students see results right after submission</p>
                                        </div>
                                        <Switch
                                            id="show_results_immediately"
                                            checked={data.show_results_immediately}
                                            onCheckedChange={(checked) => setData('show_results_immediately', checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="allow_review">Allow Review</Label>
                                            <p className="text-xs text-muted-foreground">Students can review their answers</p>
                                        </div>
                                        <Switch
                                            id="allow_review"
                                            checked={data.allow_review}
                                            onCheckedChange={(checked) => setData('allow_review', checked)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="passing_score">Passing Score (%)</Label>
                                        <Input
                                            id="passing_score"
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={data.passing_score}
                                            onChange={(e) => setData('passing_score', parseInt(e.target.value))}
                                        />
                                        <InputError message={errors.passing_score} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="max_attempts">Maximum Attempts</Label>
                                        <Input
                                            id="max_attempts"
                                            type="number"
                                            min="1"
                                            max="5"
                                            value={data.max_attempts}
                                            onChange={(e) => setData('max_attempts', parseInt(e.target.value))}
                                        />
                                        <InputError message={errors.max_attempts} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Exam Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Exam Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Questions:</span>
                                    <span className="font-medium">{data.selected_questions.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total Points:</span>
                                    <span className="font-medium">{totalPoints}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Duration:</span>
                                    <span className="font-medium">{data.duration_minutes} minutes</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Passing Score:</span>
                                    <span className="font-medium">{data.passing_score}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Max Attempts:</span>
                                    <span className="font-medium">{data.max_attempts}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Button type="submit" className="w-full" disabled={processing || data.selected_questions.length === 0}>
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Creating Exam...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Save className="h-4 w-4" />
                                        Create Exam
                                    </div>
                                )}
                            </Button>

                            <Link href="/exams" className="block">
                                <Button variant="outline" className="w-full" type="button">
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
