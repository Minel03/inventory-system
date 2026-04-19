import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BarChart3, Box, LayoutGrid, Package, Settings, ShoppingCart, Store, Truck, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'User Management',
        url: '/users',
        icon: Users,
    },
    {
        title: 'Inventory Setup',
        url: '#',
        icon: Box,
        items: [
            {
                title: 'Items',
                url: '/items',
            },
            {
                title: 'Categories',
                url: '/categories',
            },
            {
                title: 'Units of Measure',
                url: '/units',
            },
        ],
    },
    {
        title: 'Suppliers',
        url: '/suppliers',
        icon: Truck,
    },
    {
        title: 'Warehouses',
        url: '/warehouses',
        icon: Store,
    },
    {
        title: 'Purchasing',
        url: '#',
        icon: ShoppingCart,
        items: [
            {
                title: 'Requisitions & Orders',
                url: '/purchases',
            },
        ],
    },
    {
        title: 'Stock Transfers',
        url: '/transfers',
        icon: Package,
    },
    {
        title: 'Configuration',
        url: '/configuration',
        icon: Settings,
    },
    {
        title: 'Reports',
        url: '/reports',
        icon: BarChart3,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const userRole = auth.user.role;

    const filteredNavItems = mainNavItems.filter((item) => {
        if (item.title === 'User Management') {
            return userRole === 'admin';
        }
        return true;
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
