// import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
// import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
// import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// export default function Dashboard() {
//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Dashboard" />
//             <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
//                 <div className="grid auto-rows-min gap-4 md:grid-cols-3">
//                     <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
//                         <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
//                     </div>
//                     <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
//                         <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
//                     </div>
//                     <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
//                         <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
//                     </div>
//                 </div>
//                 <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
//                     <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
//                 </div>
//             </div>
//         </AppLayout>
//     );
// }
// resources/js/Pages/Dashboard.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { DashboardProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Calendar, Clock, Eye, FileQuestion, GraduationCap, Plus, Target, TrendingUp, Users } from 'lucide-react';

export default function Dashboard({ user, stats, recent_classes, recent_exams }: DashboardProps) {
    const isTeacher = user.roles.some((role) => role.name === 'teacher');
    const isStudent = user.roles.some((role) => role.name === 'student');

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
                            <p className="mt-2 text-blue-100">
                                {isTeacher && 'Ready to create engaging lessons and track student progress?'}
                                {isStudent && 'Ready to continue your learning journey?'}
                            </p>
                        </div>
                        <div className="hidden md:block">
                            {isTeacher && <GraduationCap className="h-16 w-16 text-blue-200" />}
                            {isStudent && <BookOpen className="h-16 w-16 text-blue-200" />}
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {isTeacher && (
                            <>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats.classes_count || 0}</div>
                                        <p className="text-xs text-muted-foreground">Active teaching classes</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Question Bank</CardTitle>
                                        <FileQuestion className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats.questions_count || 0}</div>
                                        <p className="text-xs text-muted-foreground">Questions created</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats.exams_count || 0}</div>
                                        <p className="text-xs text-muted-foreground">Exams created</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                                        <Plus className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <Link href="/classes/create">
                                                <Button size="sm" className="w-full" variant="outline">
                                                    Create Class
                                                </Button>
                                            </Link>
                                            <Link href="/exams/create">
                                                <Button size="sm" className="w-full" variant="outline">
                                                    Create Exam
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}

                        {isStudent && (
                            <>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Enrolled Classes</CardTitle>
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats.classes_count || 0}</div>
                                        <p className="text-xs text-muted-foreground">Active enrollments</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Completed Exams</CardTitle>
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats.completed_exams || 0}</div>
                                        <p className="text-xs text-muted-foreground">Exams finished</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                                        <Target className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats.average_score ? `${stats.average_score.toFixed(1)}%` : 'N/A'}</div>
                                        <p className="text-xs text-muted-foreground">Overall performance</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                                        <Plus className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <Link href="/classes/join">
                                                <Button size="sm" className="w-full" variant="outline">
                                                    Join Class
                                                </Button>
                                            </Link>
                                            <Link href="/my-exams">
                                                <Button size="sm" className="w-full" variant="outline">
                                                    View Exams
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </div>
                )}

                {/* Content Section */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Teacher Content */}
                    {isTeacher && recent_classes && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Recent Classes</CardTitle>
                                        <CardDescription>Your most recently created classes</CardDescription>
                                    </div>
                                    <Link href="/classes">
                                        <Button variant="outline" size="sm">
                                            View All
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {recent_classes.length > 0 ? (
                                    <div className="space-y-4">
                                        {recent_classes.map((classItem) => (
                                            <div key={classItem.id} className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="flex-1">
                                                    <h4 className="font-medium">{classItem.name}</h4>
                                                    <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Users className="h-3 w-3" />
                                                            {classItem.students_count || 0} students
                                                        </span>
                                                        <span>Code: {classItem.class_code}</span>
                                                    </div>
                                                    {classItem.subject && (
                                                        <Badge variant="secondary" className="mt-2">
                                                            {classItem.subject}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <Link href={`/classes/${classItem.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-muted-foreground">
                                        <Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                        <p>No classes created yet</p>
                                        <Link href="/classes/create">
                                            <Button className="mt-4">Create Your First Class</Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Student Content */}
                    {isStudent && recent_exams && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Recent Exam Results</CardTitle>
                                        <CardDescription>Your latest exam performances</CardDescription>
                                    </div>
                                    <Link href="/my-exams">
                                        <Button variant="outline" size="sm">
                                            View All
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {recent_exams.length > 0 ? (
                                    <div className="space-y-4">
                                        {recent_exams.map((attempt) => (
                                            <div key={attempt.id} className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="flex-1">
                                                    <h4 className="font-medium">{attempt.exam?.title}</h4>
                                                    <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {formatDate(attempt.created_at)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {attempt.completed_at && formatTime(attempt.completed_at)}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <Badge variant={attempt.status === 'completed' ? 'default' : 'secondary'}>
                                                            {attempt.status.replace('_', ' ').toUpperCase()}
                                                        </Badge>
                                                        {attempt.percentage !== null && (
                                                            <Badge variant={attempt.percentage >= 70 ? 'default' : 'destructive'}>
                                                                {attempt.percentage.toFixed(1)}%
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                {attempt.exam && (
                                                    <Link href={`/exams/${attempt.exam.id}/result`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-muted-foreground">
                                        <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                        <p>No exam attempts yet</p>
                                        <Link href="/classes/join">
                                            <Button className="mt-4">Join a Class to Start</Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Activity/Performance Chart Card (placeholder) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                {isTeacher ? 'Class Performance' : 'Your Progress'}
                            </CardTitle>
                            <CardDescription>
                                {isTeacher ? 'Overview of student performance trends' : 'Your learning progress over time'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="py-8 text-center text-muted-foreground">
                                <TrendingUp className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                <p>Performance analytics coming soon</p>
                                <p className="text-sm">Track detailed progress and insights</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
