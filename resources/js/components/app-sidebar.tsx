// import { NavFooter } from '@/components/nav-footer';
// import { NavMain } from '@/components/nav-main';
// import { NavUser } from '@/components/nav-user';
// import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
// import { type NavItem } from '@/types';
// import { Link } from '@inertiajs/react';
// import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
// import AppLogo from './app-logo';

// const mainNavItems: NavItem[] = [
//     {
//         title: 'Dashboard',
//         href: '/dashboard',
//         icon: LayoutGrid,
//     },
// ];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

// export function AppSidebar() {
//     return (
//         <Sidebar collapsible="icon" variant="inset">
//             <SidebarHeader>
//                 <SidebarMenu>
//                     <SidebarMenuItem>
//                         <SidebarMenuButton size="lg" asChild>
//                             <Link href="/dashboard" prefetch>
//                                 <AppLogo />
//                             </Link>
//                         </SidebarMenuButton>
//                     </SidebarMenuItem>
//                 </SidebarMenu>
//             </SidebarHeader>

//             <SidebarContent>
//                 <NavMain items={mainNavItems} />
//             </SidebarContent>

//             <SidebarFooter>
//                 <NavFooter items={footerNavItems} className="mt-auto" />
//                 <NavUser />
//             </SidebarFooter>
//         </Sidebar>
//     );
// }
// resources/js/layouts/app/app-sidebar.tsx
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Award, BarChart3, BookOpen, Calendar, FileQuestion, Folder, GraduationCap, LayoutGrid, Plus, Users } from 'lucide-react';

const getNavigationItems = (user: User): NavItem[] => {
    const baseItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
    ];

    // Check if user has teacher role
    const isTeacher = user.roles?.some((role) => role.name === 'teacher');
    const isStudent = user.roles?.some((role) => role.name === 'student');

    if (isTeacher) {
        return [
            ...baseItems,
            {
                title: 'Classes',
                href: '/classes',
                icon: Users,
                items: [
                    {
                        title: 'All Classes',
                        href: '/classes',
                        icon: Users,
                    },
                    {
                        title: 'Create Class',
                        href: '/classes/create',
                        icon: Plus,
                    },
                ],
            },
            {
                title: 'Question Bank',
                href: '/questions',
                icon: FileQuestion,
                items: [
                    {
                        title: 'All Questions',
                        href: '/questions',
                        icon: FileQuestion,
                    },
                    {
                        title: 'Add Question',
                        href: '/questions/create',
                        icon: Plus,
                    },
                ],
            },
            {
                title: 'Exams',
                href: '/exams',
                icon: Calendar,
                items: [
                    {
                        title: 'All Exams',
                        href: '/exams',
                        icon: Calendar,
                    },
                    {
                        title: 'Create Exam',
                        href: '/exams/create',
                        icon: Plus,
                    },
                ],
            },
            {
                title: 'Analytics',
                href: '#',
                icon: BarChart3,
                items: [
                    {
                        title: 'Performance Overview',
                        href: '/analytics/performance',
                        icon: BarChart3,
                    },
                    {
                        title: 'Question Analysis',
                        href: '/analytics/questions',
                        icon: FileQuestion,
                    },
                    {
                        title: 'Class Reports',
                        href: '/analytics/classes',
                        icon: Users,
                    },
                ],
            },
        ];
    }

    if (isStudent) {
        return [
            ...baseItems,
            {
                title: 'My Classes',
                href: '/my-classes',
                icon: BookOpen,
            },
            {
                title: 'Exams',
                href: '/my-exams',
                icon: Calendar,
                items: [
                    {
                        title: 'Available Exams',
                        href: '/my-exams',
                        icon: Calendar,
                    },
                    {
                        title: 'Completed Exams',
                        href: '/my-exams?status=completed',
                        icon: Award,
                    },
                ],
            },
            {
                title: 'Results',
                href: '/my-results',
                icon: BarChart3,
            },
            {
                title: 'Join Class',
                href: '/classes/join',
                icon: Plus,
            },
        ];
    }

    // Default navigation if no specific role
    return baseItems;
};

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs',
        icon: BookOpen,
    },
];

export default function AppSidebar() {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const mainNavItems = getNavigationItems(auth.user);

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <GraduationCap className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Teacher Assistant</span>
                                    <span className="truncate text-xs">Education Platform</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavFooter items={footerNavItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
