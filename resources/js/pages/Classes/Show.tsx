// resources/js/Pages/Classes/Show.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { ClassModel, PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Copy, Edit, FileText, Plus, Settings, UserPlus, Users } from 'lucide-react';

interface ClassShowProps extends PageProps {
    class: ClassModel;
    can_edit: boolean;
}

export default function ClassShow({ class: classItem, can_edit }: ClassShowProps) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Classes', href: '/classes' },
        { title: classItem.name, href: '#', current: true },
    ];

    const copyClassCode = () => {
        navigator.clipboard.writeText(classItem.class_code);
        // You might want to show a toast notification here
    };

    const getUserInitials = (name: string) => {
        return name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={classItem.name} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/classes">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Classes
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">{classItem.name}</h1>
                            <p className="text-muted-foreground">{classItem.description || 'No description available'}</p>
                        </div>
                    </div>

                    {can_edit && (
                        <div className="flex gap-2">
                            <Link href={`/classes/${classItem.id}/edit`}>
                                <Button variant="outline">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Class
                                </Button>
                            </Link>
                            <Link href={`/exams/create?class_id=${classItem.id}`}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Exam
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Students Enrolled</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {classItem.students_count || 0}/{classItem.max_students}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {classItem.max_students - (classItem.students_count || 0)} spots remaining
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{classItem.exams_count || 0}</div>
                            <p className="text-xs text-muted-foreground">Exams created</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Class Code</CardTitle>
                            <Copy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <code className="rounded bg-muted px-3 py-1 font-mono text-2xl font-bold">{classItem.class_code}</code>
                                <Button variant="ghost" size="sm" onClick={copyClassCode}>
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Share this code with students</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Class Details */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Class Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Class Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subject:</span>
                                <span>{classItem.subject || 'Not specified'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Grade Level:</span>
                                <span className="capitalize">{classItem.grade_level || 'Not specified'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Teacher:</span>
                                <span>{classItem.teacher?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Created:</span>
                                <span>{new Date(classItem.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status:</span>
                                <Badge variant={classItem.status === 'active' ? 'default' : 'secondary'}>
                                    {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Students List */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Students ({classItem.students?.length || 0})
                                </CardTitle>
                                {can_edit && (
                                    <Button variant="outline" size="sm">
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Add Student
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {classItem.students && classItem.students.length > 0 ? (
                                <div className="max-h-60 space-y-3 overflow-y-auto">
                                    {classItem.students.map((student) => (
                                        <div key={student.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={student.avatar} />
                                                <AvatarFallback className="text-xs">{getUserInitials(student.name)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{student.name}</p>
                                                <p className="text-xs text-muted-foreground">{student.email}</p>
                                            </div>
                                            {can_edit && (
                                                <Button variant="ghost" size="sm">
                                                    <Settings className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-muted-foreground">
                                    <Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                    <p>No students enrolled yet</p>
                                    <p className="text-sm">Share the class code to get students to join</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Exams */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Recent Exams
                            </CardTitle>
                            {can_edit && (
                                <Link href={`/exams/create?class_id=${classItem.id}`}>
                                    <Button variant="outline" size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Exam
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {classItem.exams && classItem.exams.length > 0 ? (
                            <div className="space-y-3">
                                {classItem.exams.slice(0, 5).map((exam) => (
                                    <div key={exam.id} className="flex items-center justify-between rounded-lg border p-3">
                                        <div>
                                            <h4 className="font-medium">{exam.title}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(exam.start_time).toLocaleDateString()} - {exam.duration_minutes} minutes
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={exam.status === 'published' ? 'default' : 'secondary'}>{exam.status}</Badge>
                                            <Link href={`/exams/${exam.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    View
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-muted-foreground">
                                <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                <p>No exams created yet</p>
                                {can_edit && (
                                    <Link href={`/exams/create?class_id=${classItem.id}`}>
                                        <Button className="mt-4">Create Your First Exam</Button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
