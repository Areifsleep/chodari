// resources/js/Pages/Questions/Create.tsx
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function CreateQuestion() {
    const { data, setData, post, processing, errors } = useForm({
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: '',
        subject: '',
        difficulty: 'medium',
        explanation: '',
        tags: '',
    });

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Questions', href: '/questions' },
        { title: 'Create Question', href: '/questions/create' },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('questions.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Question" />

            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/questions">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Questions
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Create New Question</h1>
                        <p className="text-muted-foreground">Add a new question to your question bank</p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Question Details</CardTitle>
                            <CardDescription>Enter the question text and answer options</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Question Text */}
                            <div className="space-y-2">
                                <Label htmlFor="question_text">Question Text *</Label>
                                <Textarea
                                    id="question_text"
                                    value={data.question_text}
                                    onChange={(e) => setData('question_text', e.target.value)}
                                    placeholder="Enter your question here..."
                                    rows={3}
                                    className="resize-none"
                                />
                                <InputError message={errors.question_text} />
                            </div>

                            {/* Answer Options */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="option_a">Option A *</Label>
                                    <Input
                                        id="option_a"
                                        value={data.option_a}
                                        onChange={(e) => setData('option_a', e.target.value)}
                                        placeholder="First option"
                                    />
                                    <InputError message={errors.option_a} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="option_b">Option B *</Label>
                                    <Input
                                        id="option_b"
                                        value={data.option_b}
                                        onChange={(e) => setData('option_b', e.target.value)}
                                        placeholder="Second option"
                                    />
                                    <InputError message={errors.option_b} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="option_c">Option C *</Label>
                                    <Input
                                        id="option_c"
                                        value={data.option_c}
                                        onChange={(e) => setData('option_c', e.target.value)}
                                        placeholder="Third option"
                                    />
                                    <InputError message={errors.option_c} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="option_d">Option D *</Label>
                                    <Input
                                        id="option_d"
                                        value={data.option_d}
                                        onChange={(e) => setData('option_d', e.target.value)}
                                        placeholder="Fourth option"
                                    />
                                    <InputError message={errors.option_d} />
                                </div>
                            </div>

                            {/* Correct Answer */}
                            <div className="space-y-3">
                                <Label>Correct Answer *</Label>
                                <RadioGroup
                                    value={data.correct_answer}
                                    onValueChange={(value) => setData('correct_answer', value)}
                                    className="grid grid-cols-4 gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="a" id="correct_a" />
                                        <Label htmlFor="correct_a">Option A</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="b" id="correct_b" />
                                        <Label htmlFor="correct_b">Option B</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="c" id="correct_c" />
                                        <Label htmlFor="correct_c">Option C</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="d" id="correct_d" />
                                        <Label htmlFor="correct_d">Option D</Label>
                                    </div>
                                </RadioGroup>
                                <InputError message={errors.correct_answer} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Question Metadata</CardTitle>
                            <CardDescription>Additional information about the question</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input
                                        id="subject"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        placeholder="e.g., Mathematics, Science"
                                    />
                                    <InputError message={errors.subject} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="difficulty">Difficulty *</Label>
                                    <Select value={data.difficulty} onValueChange={(value) => setData('difficulty', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="easy">Easy</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="hard">Hard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.difficulty} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="explanation">Explanation (Optional)</Label>
                                <Textarea
                                    id="explanation"
                                    value={data.explanation}
                                    onChange={(e) => setData('explanation', e.target.value)}
                                    placeholder="Explain why the correct answer is correct..."
                                    rows={3}
                                    className="resize-none"
                                />
                                <InputError message={errors.explanation} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags (Optional)</Label>
                                <Input
                                    id="tags"
                                    value={data.tags}
                                    onChange={(e) => setData('tags', e.target.value)}
                                    placeholder="algebra, equations, basic (separate with commas)"
                                />
                                <InputError message={errors.tags} />
                                <p className="text-xs text-muted-foreground">Separate tags with commas to help organize your questions</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Link href="/questions">
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Creating...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Save className="h-4 w-4" />
                                    Create Question
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
