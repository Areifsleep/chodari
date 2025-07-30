// resources/js/Pages/Classes/Index.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { ClassModel, PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Plus, Users } from 'lucide-react';

interface ClassesIndexProps extends PageProps {
    classes: {
        data: ClassModel[];
        links: any[];
        meta: any;
    };
    can_create: boolean;
}

export default function ClassesIndex({ classes, can_create }: ClassesIndexProps) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Classes', href: '/classes' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Classes" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Classes</h1>
                        <p className="text-muted-foreground">{can_create ? 'Manage your classes and students' : 'Your enrolled classes'}</p>
                    </div>

                    {can_create ? (
                        <Link href="/classes/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Class
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/classes/join">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Join Class
                            </Button>
                        </Link>
                    )}
                </div>

                {classes.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {classes.data.map((classItem) => (
                            <Card key={classItem.id} className="transition-shadow hover:shadow-lg">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{classItem.name}</CardTitle>
                                            <CardDescription className="mt-1">{classItem.description || 'No description available'}</CardDescription>
                                        </div>
                                        {classItem.subject && <Badge variant="secondary">{classItem.subject}</Badge>}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-1 text-muted-foreground">
                                                <Users className="h-3 w-3" />
                                                Students
                                            </span>
                                            <span className="font-medium">
                                                {classItem.students_count || 0}/{classItem.max_students}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-1 text-muted-foreground">
                                                <BookOpen className="h-3 w-3" />
                                                Exams
                                            </span>
                                            <span className="font-medium">{classItem.exams_count || 0}</span>
                                        </div>

                                        {can_create && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Class Code</span>
                                                <code className="rounded bg-muted px-2 py-1 font-mono text-xs">{classItem.class_code}</code>
                                            </div>
                                        )}

                                        <div className="pt-2">
                                            <Link href={`/classes/${classItem.id}`}>
                                                <Button variant="outline" className="w-full">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">{can_create ? 'No classes created yet' : 'No classes joined yet'}</h3>
                            <p className="mb-4 text-muted-foreground">
                                {can_create ? 'Create your first class to start teaching' : 'Join a class using a class code to get started'}
                            </p>
                            {can_create ? (
                                <Link href="/classes/create">
                                    <Button>Create Your First Class</Button>
                                </Link>
                            ) : (
                                <Link href="/classes/join">
                                    <Button>Join a Class</Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
