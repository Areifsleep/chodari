// resources/js/Pages/Exams/Index.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Exam, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { BarChart3, Calendar, Clock, Copy, Edit, Eye, FileText, PauseCircle, Play, PlayCircle, Plus, Search, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

interface ExamsIndexProps extends PageProps {
    exams: {
        data: Exam[];
        links: any[];
        meta: any;
    };
    classes: Array<{ id: number; name: string }>;
    filters: {
        search?: string;
        class_id?: string;
        status?: string;
    };
    stats: {
        total: number;
        published: number;
        draft: number;
        completed: number;
    };
    user_role: string;
}

export default function ExamsIndex({ exams, classes, filters, stats, user_role }: ExamsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedFilters, setSelectedFilters] = useState({
        class_id: filters.class_id || 'all',
        status: filters.status || 'all',
    });

    const isTeacher = user_role === 'teacher';

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Exams', href: '/exams' },
    ];

    const handleSearch = () => {
        const apiFilters = {
            class_id: selectedFilters.class_id === 'all' ? '' : selectedFilters.class_id,
            status: selectedFilters.status === 'all' ? '' : selectedFilters.status,
        };

        router.get(
            '/exams',
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

        const apiFilters = {
            class_id: newFilters.class_id === 'all' ? '' : newFilters.class_id,
            status: newFilters.status === 'all' ? '' : newFilters.status,
        };

        router.get(
            '/exams',
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
        setSelectedFilters({ class_id: 'all', status: 'all' });
        router.get('/exams', {}, { preserveState: true, replace: true });
    };

    const duplicateExam = (examId: number) => {
        router.post(`/exams/${examId}/duplicate`);
    };

    const deleteExam = (examId: number) => {
        if (confirm('Are you sure you want to delete this exam?')) {
            router.delete(`/exams/${examId}`);
        }
    };

    const toggleExamStatus = (examId: number) => {
        router.post(`/exams/${examId}/toggle-status`);
    };

    const hasActiveFilters = () => {
        return search || selectedFilters.class_id !== 'all' || selectedFilters.status !== 'all';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            case 'published':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'archived':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isExamActive = (exam: Exam) => {
        const now = new Date();
        const startTime = new Date(exam.start_time);
        const endTime = new Date(exam.end_time);
        return exam.status === 'published' && now >= startTime && now <= endTime;
    };

    const canTakeExam = (exam: Exam) => {
        return !isTeacher && exam.status === 'published' && isExamActive(exam);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Exams" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{isTeacher ? 'Exam Management' : 'My Exams'}</h1>
                        <p className="text-muted-foreground">
                            {isTeacher ? 'Create and manage your exams' : 'View available exams and your results'}
                        </p>
                    </div>
                    {isTeacher && (
                        <Link href="/exams/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Exam
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{isTeacher ? 'Published' : 'Available'}</CardTitle>
                            <Play className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.published}</div>
                        </CardContent>
                    </Card>

                    {isTeacher && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Draft</CardTitle>
                                <Edit className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.draft}</div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <BarChart3 className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completed}</div>
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
                                        placeholder="Search exams..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <Select value={selectedFilters.class_id} onValueChange={(value) => handleFilterChange('class_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Classes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Classes</SelectItem>
                                    {classes.map((classItem) => (
                                        <SelectItem key={classItem.id} value={classItem.id.toString()}>
                                            {classItem.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedFilters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
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

                {/* Exams List */}
                {exams.data.length > 0 ? (
                    <div className="space-y-4">
                        {exams.data.map((exam) => (
                            <Card key={exam.id} className="transition-shadow hover:shadow-md">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="mb-3 flex items-start justify-between">
                                                <div>
                                                    <h3 className="mb-1 text-lg leading-tight font-medium">{exam.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{exam.description || 'No description available'}</p>
                                                </div>
                                                <div className="ml-4 flex flex-shrink-0 items-center gap-2">
                                                    <Badge className={getStatusColor(exam.status)}>{exam.status}</Badge>
                                                    {isExamActive(exam) && <Badge className="animate-pulse bg-red-100 text-red-800">LIVE</Badge>}
                                                </div>
                                            </div>

                                            <div className="mb-3 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                    <span>{exam.class?.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span>{exam.duration_minutes} minutes</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                    <span>{exam.questions_count || 0} questions</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                                    <span>{exam.attempts_count || 0} attempts</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>Start: {formatDateTime(exam.start_time)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>End: {formatDateTime(exam.end_time)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-shrink-0 flex-col gap-2">
                                            {/* Student Actions */}
                                            {!isTeacher && (
                                                <>
                                                    {canTakeExam(exam) && (
                                                        <Link href={`/exams/${exam.id}/take`}>
                                                            <Button size="sm" className="w-full">
                                                                <Play className="mr-2 h-4 w-4" />
                                                                Take Exam
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    <Link href={`/exams/${exam.id}/result`}>
                                                        <Button variant="outline" size="sm" className="w-full">
                                                            <BarChart3 className="mr-2 h-4 w-4" />
                                                            View Result
                                                        </Button>
                                                    </Link>
                                                </>
                                            )}

                                            {/* Teacher Actions */}
                                            {isTeacher && (
                                                <>
                                                    <Link href={`/exams/${exam.id}`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/exams/${exam.id}/edit`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button variant="ghost" size="sm" onClick={() => duplicateExam(exam.id)}>
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                    <Link href={`/exams/${exam.id}/results`}>
                                                        <Button variant="ghost" size="sm">
                                                            <BarChart3 className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button variant="ghost" size="sm" onClick={() => toggleExamStatus(exam.id)}>
                                                        {exam.status === 'published' ? (
                                                            <PauseCircle className="h-4 w-4" />
                                                        ) : (
                                                            <PlayCircle className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => deleteExam(exam.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">
                                {hasActiveFilters() ? 'No exams found' : isTeacher ? 'No exams created yet' : 'No exams available'}
                            </h3>
                            <p className="mb-4 text-muted-foreground">
                                {hasActiveFilters()
                                    ? 'No exams match your current filters'
                                    : isTeacher
                                      ? 'Create your first exam to start testing students'
                                      : 'Check back later for new exams from your teachers'}
                            </p>
                            {!hasActiveFilters() && isTeacher ? (
                                <Link href="/exams/create">
                                    <Button>Create Your First Exam</Button>
                                </Link>
                            ) : hasActiveFilters() ? (
                                <Button variant="outline" onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            ) : null}
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {exams.data.length > 0 && exams.links && (
                    <div className="flex justify-center">
                        <div className="flex items-center gap-2">
                            {exams.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => {
                                        if (link.url) {
                                            router.visit(link.url, { preserveState: true });
                                        }
                                    }}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
