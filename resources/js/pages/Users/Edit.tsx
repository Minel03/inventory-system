import { Head, Link, useForm } from '@inertiajs/react';
import { BreadcrumbItem, User, Warehouse } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Shield, Store } from 'lucide-react';
import Heading from '@/components/heading';

interface Props {
    user: User;
    warehouses: Warehouse[];
    roles: { id: string; name: string }[];
}

export default function UsersEdit({ user, warehouses, roles }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        role: user.role || 'warehouse',
        warehouse_id: user.warehouse_id?.toString() || 'none',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'User Management', href: '/users' },
        { title: `Edit ${user.name}`, href: `/users/${user.id}/edit` },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/users/${user.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Access: ${user.name}`} />
            <div className="flex flex-1 flex-col gap-4 p-4 max-w-2xl mx-auto w-full">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/users"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <Heading 
                        title={`Edit Access: ${user.name}`} 
                        description={user.email} 
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" /> Permissions Role
                            </CardTitle>
                            <CardDescription>
                                Defines what actions the user can perform (Approve PR, Sign PO, etc.)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">Functional Role</Label>
                                <Select value={data.role} onValueChange={(val) => setData('role', val)}>
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role.id} value={role.id}>
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Store className="h-4 w-4 text-primary" /> Warehouse Assignment
                            </CardTitle>
                            <CardDescription>
                                Restricted users only see stock and orders for their assigned warehouse.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="warehouse">Assigned Warehouse</Label>
                                <Select 
                                    value={data.warehouse_id} 
                                    onValueChange={(val) => setData('warehouse_id', val)}
                                >
                                    <SelectTrigger id="warehouse">
                                        <SelectValue placeholder="Select a warehouse" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Global Access (No Restriction)</SelectItem>
                                        {warehouses.map((w) => (
                                            <SelectItem key={w.id} value={w.id.toString()}>
                                                {w.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.warehouse_id && <p className="text-sm text-destructive">{errors.warehouse_id}</p>}
                                <p className="text-xs text-muted-foreground mt-2 italic">
                                    Note: Warehouse staff <strong>must</strong> be assigned to a specific warehouse to see data.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/50 border-t p-4 flex justify-between items-center">
                            <div className="text-xs text-muted-foreground italic">
                                Last updated: {new Date(user.updated_at).toLocaleDateString()}
                            </div>
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2 h-4 w-4" />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
