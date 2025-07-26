// resources/js/Pages/Auth/Register.tsx
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { BookOpen, GraduationCap, LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'student', // Default to student
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create account" description="Choose your role and create your account to get started">
            <Head title="Register" />

            <form onSubmit={submit} className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-3">
                    <Label htmlFor="role" className="text-sm font-medium">
                        I am a...
                    </Label>
                    <RadioGroup value={data.role} onValueChange={(value) => setData('role', value)} className="grid grid-cols-2 gap-4">
                        {/* Student Option */}
                        <div className="relative">
                            <RadioGroupItem value="student" id="student" className="peer sr-only" />
                            <Label
                                htmlFor="student"
                                className="flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 transition-colors peer-data-[state=checked]:border-primary hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                            >
                                <BookOpen className="mb-3 h-8 w-8 text-blue-500" />
                                <div className="text-center">
                                    <div className="font-semibold">Student</div>
                                    <div className="mt-1 text-xs text-muted-foreground">Join classes and take exams</div>
                                </div>
                            </Label>
                        </div>

                        {/* Teacher Option */}
                        <div className="relative">
                            <RadioGroupItem value="teacher" id="teacher" className="peer sr-only" />
                            <Label
                                htmlFor="teacher"
                                className="flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 transition-colors peer-data-[state=checked]:border-primary hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                            >
                                <GraduationCap className="mb-3 h-8 w-8 text-green-500" />
                                <div className="text-center">
                                    <div className="font-semibold">Teacher</div>
                                    <div className="mt-1 text-xs text-muted-foreground">Create classes and manage exams</div>
                                </div>
                            </Label>
                        </div>
                    </RadioGroup>
                    <InputError message={errors.role} />
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Enter your full name"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="Enter your email address"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Create a strong password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    {/* Role-specific information */}
                    {data.role && (
                        <Card className="bg-muted/50">
                            <CardContent className="pt-4">
                                {data.role === 'student' ? (
                                    <div className="flex items-start gap-3">
                                        <BookOpen className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
                                        <div className="text-sm">
                                            <p className="font-medium text-foreground">As a Student, you can:</p>
                                            <ul className="mt-1 space-y-1 text-muted-foreground">
                                                <li>• Join classes using class codes</li>
                                                <li>• Take online exams and quizzes</li>
                                                <li>• View your results and progress</li>
                                                <li>• Access class materials and announcements</li>
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-3">
                                        <GraduationCap className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                        <div className="text-sm">
                                            <p className="font-medium text-foreground">As a Teacher, you can:</p>
                                            <ul className="mt-1 space-y-1 text-muted-foreground">
                                                <li>• Create and manage classes</li>
                                                <li>• Build question banks and create exams</li>
                                                <li>• Monitor student progress and performance</li>
                                                <li>• Generate detailed analytics and reports</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    <Button type="submit" className="w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Create {data.role} account
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
