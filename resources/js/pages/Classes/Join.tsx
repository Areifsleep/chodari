// resources/js/Pages/Classes/Join.tsx
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, UserPlus, Users } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function JoinClass({}: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        class_code: '',
    });

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Classes', href: '/classes' },
        { title: 'Join Class', href: '/classes/join', current: true },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('classes.join'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Join Class" />

            <div className="mx-auto max-w-md space-y-6">
                <div className="text-center">
                    <Link href="/classes">
                        <Button variant="outline" size="sm" className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Classes
                        </Button>
                    </Link>
                    <Users className="mx-auto mb-4 h-16 w-16 text-blue-600" />
                    <h1 className="text-3xl font-bold">Join a Class</h1>
                    <p className="text-muted-foreground">Enter the class code provided by your teacher</p>
                </div>

                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserPlus className="h-5 w-5" />
                                Class Code
                            </CardTitle>
                            <CardDescription>Ask your teacher for the 6-character class code</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="class_code">Class Code *</Label>
                                <Input
                                    id="class_code"
                                    value={data.class_code}
                                    onChange={(e) => setData('class_code', e.target.value.toUpperCase())}
                                    placeholder="Enter 6-character code"
                                    maxLength={6}
                                    className="text-center font-mono text-lg tracking-wider"
                                    required
                                />
                                <InputError message={errors.class_code} />
                                <p className="text-center text-xs text-muted-foreground">Example: ABC123</p>
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Joining...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <UserPlus className="h-4 w-4" />
                                        Join Class
                                    </div>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </form>

                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have a class code? <span className="font-medium text-blue-600">Ask your teacher for one</span>
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
