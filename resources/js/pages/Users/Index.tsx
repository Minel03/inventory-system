import { Head, Link } from '@inertiajs/react';
import { BreadcrumbItem, User, Warehouse } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Shield, Store, User as UserIcon } from 'lucide-react';
import Heading from '@/components/heading';

interface UserWithWarehouse extends User {
    warehouse?: Warehouse;
}

interface Props {
    users: UserWithWarehouse[];
}

const ROLE_LABELS: Record<string, string> = {
    admin: 'Administrator',
    manager: 'Manager',
    buyer: 'Buyer',
    approver_l1: 'Level 1 Approver',
    approver_l2: 'Level 2 Approver',
    warehouse: 'Warehouse Staff',
};

const ROLE_COLORS: Record<string, string> = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    manager: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    buyer: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    approver_l1: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    approver_l2: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    warehouse: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/users',
    },
];

export default function UsersIndex({ users }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading 
                        title="User Management" 
                        description="Assign roles and warehouses to employees to control access and approvals." 
                    />
                </div>

                <div className="rounded-md border bg-card overflow-x-auto">
                    <table className="w-full text-sm min-w-[600px] md:min-w-0">
                        <thead>
                            <tr className="border-b">
                                <th className="text-muted-foreground h-12 px-4 text-left font-medium w-[300px]">User</th>
                                <th className="text-muted-foreground h-12 px-4 text-left font-medium">Role</th>
                                <th className="text-muted-foreground h-12 px-4 text-left font-medium">Assigned Warehouse</th>
                                <th className="text-muted-foreground h-12 px-4 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <TableRow key={user.id} user={user} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

function TableRow({ user }: { user: UserWithWarehouse }) {
    return (
        <tr className="border-b transition-colors hover:bg-muted/50">
            <td className="p-4 align-middle">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                </div>
            </td>
            <td className="p-4 align-middle">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`font-medium ${user.role ? ROLE_COLORS[user.role] : 'bg-gray-100 text-gray-800'}`}>
                        <Shield className="mr-1 h-3 w-3" />
                        {user.role ? (ROLE_LABELS[user.role] || user.role) : 'No Role Assigned'}
                    </Badge>
                </div>
            </td>
            <td className="p-4 align-middle">
                {user.warehouse ? (
                    <div className="flex items-center gap-2 text-sm">
                        <Store className="h-4 w-4 text-muted-foreground" />
                        {user.warehouse.name}
                    </div>
                ) : (
                    <span className="text-xs text-muted-foreground italic">Global Access</span>
                )}
            </td>
            <td className="p-4 align-middle text-right">
                <Button variant="ghost" size="sm" asChild>
                    <Link href={`/users/${user.id}/edit`}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit Access
                    </Link>
                </Button>
            </td>
        </tr>
    );
}
