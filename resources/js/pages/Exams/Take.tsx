// resources/js/Pages/Exams/Take.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AppLayout from '@/layouts/app-layout';
import { Exam, ExamAttempt, PageProps, Question } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle, Circle, Flag } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TakeExamProps extends PageProps {
    exam: Exam & {
        questions: (Question & { pivot: { question_order: number; points: number } })[];
    };
    attempt: ExamAttempt;
    current_answers: Record<number, string>;
}

export default function TakeExam({ exam, attempt, current_answers }: TakeExamProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>(current_answers || {});
    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());

    const { data, setData, post, processing } = useForm({
        answers: current_answers || {},
    });

    const questions = exam.questions.sort((a, b) => (a.pivot?.question_order || 0) - (b.pivot?.question_order || 0));
    const currentQuestion = questions[currentQuestionIndex];

    // Calculate time remaining
    useEffect(() => {
        if (attempt.started_at) {
            const startTime = new Date(attempt.started_at).getTime();
            const duration = exam.duration_minutes * 60 * 1000; // Convert to milliseconds
            const endTime = startTime + duration;

            const updateTimer = () => {
                const now = Date.now();
                const remaining = Math.max(0, endTime - now);
                setTimeRemaining(Math.floor(remaining / 1000)); // Convert to seconds

                if (remaining <= 0) {
                    submitExam();
                }
            };

            updateTimer();
            const interval = setInterval(updateTimer, 1000);
            return () => clearInterval(interval);
        }
    }, [attempt.started_at, exam.duration_minutes]);

    // Auto-save every 30 seconds
    useEffect(() => {
        const autoSave = setInterval(() => {
            if (Object.keys(answers).length > 0) {
                router.post(
                    `/exams/${exam.id}/save-progress`,
                    { answers },
                    {
                        preserveScroll: true,
                        preserveState: true,
                    },
                );
            }
        }, 30000);

        return () => clearInterval(autoSave);
    }, [answers, exam.id]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (questionId: number, answer: string) => {
        const newAnswers = { ...answers, [questionId]: answer };
        setAnswers(newAnswers);
        setData('answers', newAnswers);
    };

    const toggleFlag = (questionId: number) => {
        const newFlagged = new Set(flaggedQuestions);
        if (newFlagged.has(questionId)) {
            newFlagged.delete(questionId);
        } else {
            newFlagged.add(questionId);
        }
        setFlaggedQuestions(newFlagged);
    };

    const goToQuestion = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const submitExam = () => {
        if (confirm('Are you sure you want to submit your exam? This action cannot be undone.')) {
            post(`/exams/${exam.id}/submit`);
        }
    };

    const getQuestionStatus = (questionId: number) => {
        if (answers[questionId]) return 'answered';
        if (flaggedQuestions.has(questionId)) return 'flagged';
        return 'unanswered';
    };

    const progress = (Object.keys(answers).length / questions.length) * 100;
    const isTimeRunningOut = timeRemaining < 300; // Less than 5 minutes

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Exams', href: '/my-exams' },
        { title: exam.title, href: `/exams/${exam.id}` },
        { title: 'Take Exam', href: `/exams/${exam.id}/take`, current: true },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Taking: ${exam.title}`} />

            <div className="mx-auto max-w-7xl space-y-6">
                {/* Exam Header */}
                <Card className={`${isTimeRunningOut ? 'border-red-500' : ''}`}>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-2xl">{exam.title}</CardTitle>
                                <CardDescription>
                                    Question {currentQuestionIndex + 1} of {questions.length}
                                </CardDescription>
                            </div>
                            <div className="text-right">
                                <div className={`text-2xl font-bold ${isTimeRunningOut ? 'text-red-600' : 'text-green-600'}`}>
                                    {formatTime(timeRemaining)}
                                </div>
                                <p className="text-sm text-muted-foreground">Time Remaining</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>
                                    Progress: {Object.keys(answers).length}/{questions.length} answered
                                </span>
                                <span>{progress.toFixed(0)}% complete</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    </CardHeader>
                </Card>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    {/* Question Panel */}
                    <div className="lg:col-span-3">
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-lg">
                                        Question {currentQuestionIndex + 1}
                                        <Badge variant="outline" className="ml-2">
                                            {currentQuestion.pivot.points} point{currentQuestion.pivot.points !== 1 ? 's' : ''}
                                        </Badge>
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleFlag(currentQuestion.id)}
                                        className={flaggedQuestions.has(currentQuestion.id) ? 'text-yellow-600' : ''}
                                    >
                                        <Flag className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="prose max-w-none">
                                    <p className="text-lg leading-relaxed">{currentQuestion.question_text}</p>
                                </div>

                                <RadioGroup
                                    value={answers[currentQuestion.id] || ''}
                                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                                    className="space-y-4"
                                >
                                    {['a', 'b', 'c', 'd'].map((option) => (
                                        <div key={option} className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-gray-50">
                                            <RadioGroupItem value={option} id={`${currentQuestion.id}-${option}`} className="mt-1" />
                                            <Label
                                                htmlFor={`${currentQuestion.id}-${option}`}
                                                className="flex-1 cursor-pointer text-base leading-relaxed"
                                            >
                                                <span className="mr-2 font-medium">{option.toUpperCase()}.</span>
                                                {currentQuestion[`option_${option}` as keyof Question] as string}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>

                                {/* Navigation */}
                                <div className="flex items-center justify-between border-t pt-6">
                                    <Button variant="outline" onClick={previousQuestion} disabled={currentQuestionIndex === 0}>
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Previous
                                    </Button>

                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => toggleFlag(currentQuestion.id)}>
                                            <Flag className="mr-2 h-4 w-4" />
                                            {flaggedQuestions.has(currentQuestion.id) ? 'Unflag' : 'Flag'}
                                        </Button>

                                        {currentQuestionIndex === questions.length - 1 ? (
                                            <Button onClick={submitExam} className="bg-green-600 hover:bg-green-700">
                                                Submit Exam
                                            </Button>
                                        ) : (
                                            <Button onClick={nextQuestion}>
                                                Next
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Question Navigator */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Question Navigator</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-5 gap-2">
                                    {questions.map((question, index) => {
                                        const status = getQuestionStatus(question.id);
                                        const isCurrent = index === currentQuestionIndex;

                                        return (
                                            <Button
                                                key={question.id}
                                                variant={isCurrent ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => goToQuestion(index)}
                                                className={`relative ${
                                                    status === 'answered'
                                                        ? 'border-green-500 bg-green-100'
                                                        : status === 'flagged'
                                                          ? 'border-yellow-500 bg-yellow-100'
                                                          : 'bg-gray-100'
                                                }`}
                                            >
                                                {index + 1}
                                                {status === 'answered' && <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-600" />}
                                                {status === 'flagged' && <Flag className="absolute -top-1 -right-1 h-3 w-3 text-yellow-600" />}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Legend</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                    <span>Answered</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Flag className="h-3 w-3 text-yellow-600" />
                                    <span>Flagged</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Circle className="h-3 w-3 text-gray-400" />
                                    <span>Unanswered</span>
                                </div>
                            </CardContent>
                        </Card>

                        {isTimeRunningOut && (
                            <Card className="border-red-500">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 text-red-600">
                                        <AlertTriangle className="h-4 w-4" />
                                        <span className="text-sm font-medium">Time Running Out!</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
