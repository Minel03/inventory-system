import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Hash, Package, Settings, Tag } from 'lucide-react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'General',
        url: '/configuration',
        icon: Settings,
    },
    {
        title: 'Items',
        url: '/configuration/items',
        icon: Package,
    },
    {
        title: 'Categories',
        url: '/configuration/categories',
        icon: Tag,
    },
    {
        title: 'PR & PO',
        url: '/configuration/numbering',
        icon: Hash,
    },
];

export default function ConfigurationLayout({ children }: { children: React.ReactNode }) {
    const currentPath = window.location.pathname;

    return (
        <AppLayout>
            <div className="px-4 py-6">
                <Heading title="System Configuration" description="Manage system-wide settings and automation rules." />

                <div className="mt-6 flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                    <aside className="w-full lg:w-48">
                        <nav className="flex flex-col space-y-1">
                            {sidebarNavItems.map((item) => (
                                <Button
                                    key={item.url}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn('w-full justify-start', {
                                        'bg-muted font-semibold': currentPath === item.url,
                                    })}
                                >
                                    <Link href={item.url}>
                                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                        {item.title}
                                    </Link>
                                </Button>
                            ))}
                        </nav>
                    </aside>

                    <Separator className="my-6 lg:hidden" />

                    <div className="flex-1 lg:max-w-3xl">
                        <section className="space-y-6">{children}</section>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
