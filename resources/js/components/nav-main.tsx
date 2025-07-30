// import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
// import { type NavItem } from '@/types';
// import { Link, usePage } from '@inertiajs/react';

// export function NavMain({ items = [] }: { items: NavItem[] }) {
//     const page = usePage();
//     return (
//         <SidebarGroup className="px-2 py-0">
//             <SidebarGroupLabel>Platform</SidebarGroupLabel>
//             <SidebarMenu>
//                 {items.map((item) => (
//                     <SidebarMenuItem key={item.title}>
//                         <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
//                             <Link href={item.href} prefetch>
//                                 {item.icon && <item.icon />}
//                                 <span>{item.title}</span>
//                             </Link>
//                         </SidebarMenuButton>
//                     </SidebarMenuItem>
//                 ))}
//             </SidebarMenu>
//         </SidebarGroup>
//     );
// }
// resources/js/components/nav-main.tsx
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface NavMainProps {
    items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
    const { url } = usePage();
    const [openItems, setOpenItems] = useState<string[]>([]);

    const toggleItem = (title: string) => {
        setOpenItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]));
    };

    const isItemActive = (href: string) => {
        return url === href || url.startsWith(href + '/');
    };

    const hasActiveChild = (items?: NavItem[]) => {
        return items?.some((item) => isItemActive(item.href)) || false;
    };

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const hasChildren = item.items && item.items.length > 0;
                    const isOpen = openItems.includes(item.title);
                    const isActive = isItemActive(item.href);
                    const hasActiveChildItem = hasActiveChild(item.items);

                    if (hasChildren) {
                        return (
                            <Collapsible key={item.title} asChild open={isOpen || hasActiveChildItem} onOpenChange={() => toggleItem(item.title)}>
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={item.title} isActive={isActive || hasActiveChildItem}>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton asChild isActive={isItemActive(subItem.href)}>
                                                        <Link href={subItem.href}>
                                                            {subItem.icon && <subItem.icon />}
                                                            <span>{subItem.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        );
                    }

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                                <Link href={item.href}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
