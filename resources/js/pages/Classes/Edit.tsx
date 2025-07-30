// resources/js/Pages/Classes/Edit.tsx
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { ClassModel, PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Trash2, Users } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface EditClassProps extends PageProps {
    class: ClassModel; // This is the existing class data
}

export default function EditClass({ class: classItem }: EditClassProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Initialize form with existing class data
    const { data, setData, put, processing, errors } = useForm({
        name: classItem.name,
        description: classItem.description || '',
        subject: classItem.subject || '',
        grade_level: classItem.grade_level || '',
        max_students: classItem.max_students,
    });

    const { delete: destroy, processing: deleting } = useForm();

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Classes', href: '/classes' },
        { title: classItem.name, href: `/classes/${classItem.id}` },
        { title: 'Edit', href: '', current: true },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('classes.update', classItem.id));
    };

    const handleDelete = () => {
        destroy(route('classes.destroy', classItem.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${classItem.name}`} />

            <div className="mx-auto max-w-2xl space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={`/classes/${classItem.id}`}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Class
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Class</h1>
                        <p className="text-muted-foreground">Update your class information</p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Class Information
                            </CardTitle>
                            <CardDescription>Update the details for your class</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Class Name *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g., Mathematics Grade 10"
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Brief description of what this class covers..."
                                    rows={3}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input
                                        id="subject"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        placeholder="e.g., Mathematics, Science, English"
                                    />
                                    <InputError message={errors.subject} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="grade_level">Grade Level</Label>
                                    <Select value={data.grade_level} onValueChange={(value) => setData('grade_level', value === 'none' ? '' : value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select grade level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None selected</SelectItem>
                                            <SelectItem value="elementary">Elementary</SelectItem>
                                            <SelectItem value="middle">Middle School</SelectItem>
                                            <SelectItem value="high">High School</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.grade_level} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="max_students">Maximum Students</Label>
                                <Input
                                    id="max_students"
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={data.max_students}
                                    onChange={(e) => setData('max_students', parseInt(e.target.value))}
                                />
                                <InputError message={errors.max_students} />
                                <p className="text-xs text-muted-foreground">Current enrollment: {classItem.students_count || 0} students</p>
                            </div>

                            {/* Read-only information */}
                            <div className="grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Class Code</Label>
                                    <div className="rounded-md bg-muted p-3">
                                        <code className="font-mono text-lg font-bold">{classItem.class_code}</code>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Class code cannot be changed</p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Created</Label>
                                    <div className="rounded-md bg-muted p-3">{new Date(classItem.created_at).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-between">
                        <Button type="button" variant="destructive" onClick={() => setShowDeleteDialog(true)} disabled={deleting}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Class
                        </Button>

                        <div className="flex gap-4">
                            <Link href={`/classes/${classItem.id}`}>
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Updating...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Save className="h-4 w-4" />
                                        Update Class
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>

                {/* Delete Confirmation Dialog */}
                {showDeleteDialog && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <Card className="w-full max-w-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-600">
                                    <Trash2 className="h-5 w-5" />
                                    Delete Class
                                </CardTitle>
                                <CardDescription>Are you sure you want to delete this class? This action cannot be undone.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Class Name:</span>
                                        <span className="font-medium">{classItem.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Students Enrolled:</span>
                                        <span className="font-medium">{classItem.students_count || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Exams Created:</span>
                                        <span className="font-medium">{classItem.exams_count || 0}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <div className="flex justify-end gap-2 p-6 pt-0">
                                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                                    {deleting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Deleting...
                                        </div>
                                    ) : (
                                        'Delete Class'
                                    )}
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
