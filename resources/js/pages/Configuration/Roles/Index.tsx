import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { Plus, Edit2, Shield, Users } from 'lucide-react';

interface Role {
    id: number;
    name: string;
    slug: string;
    permissions: string[];
}

interface Props {
    roles: Role[];
}

export default function RolesIndex({ roles }: Props) {
    return (
        <AppLayout>
            <Head title="Role Management" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">User Roles</h2>
                        <p className="text-muted-foreground">
                            Define and manage custom roles and their respective permissions.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('roles.create')}>
                            <Plus className="mr-2 h-4 w-4" /> New Role
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {roles.map((role) => (
                        <Card key={role.id}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">
                                    {role.name}
                                </CardTitle>
                                <Shield className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-xs text-muted-foreground mb-4">
                                    slug: {role.slug}
                                </div>
                                <div className="flex items-center space-x-2 text-sm mb-4">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span>{role.permissions?.length || 0} permissions assigned</span>
                                </div>
                                <div className="flex justify-end">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={route('roles.edit', role.id)}>
                                            <Edit2 className="mr-2 h-4 w-4" /> Edit Permissions
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
