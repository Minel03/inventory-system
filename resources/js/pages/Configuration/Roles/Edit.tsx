import ConfigurationLayout from '@/layouts/configuration/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, X, LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Permission {
    id: string;
    name: string;
    group: string;
}

interface Role {
    id?: number;
    name: string;
    permissions: string[];
}

interface Props {
    role: Role;
    availablePermissions: Permission[];
}

export default function RoleEdit({ role, availablePermissions }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: role.name || '',
        permissions: role.permissions || [],
    });

    const isEditing = !!role.id;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('roles.update', role.id));
        } else {
            post(route('roles.store'));
        }
    };

    const togglePermission = (id: string, checked: boolean) => {
        if (checked) {
            setData('permissions', [...data.permissions, id]);
        } else {
            setData('permissions', data.permissions.filter(p => p !== id));
        }
    };

    // Group permissions by their 'group' field
    const groupedPermissions = availablePermissions.reduce((acc, p) => {
        if (!acc[p.group]) acc[p.group] = [];
        acc[p.group].push(p);
        return acc;
    }, {} as Record<string, Permission[]>);

    return (
        <ConfigurationLayout>
            <Head title={isEditing ? 'Edit Role' : 'Create Role'} />
            
            <form onSubmit={submit} className="space-y-6 max-w-4xl">
                <Card>
                    <CardHeader>
                        <CardTitle>{isEditing ? 'Role Permissions' : 'New Role'}</CardTitle>
                        <CardDescription>
                            Define what users assigned to this role can see and do within the system.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Role Name</Label>
                            <Input 
                                id="name" 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)}
                                placeholder="e.g. Sales Manager"
                                required
                            />
                            {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                        </div>

                        <div className="space-y-6 pt-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Permissions</h3>
                            {Object.entries(groupedPermissions).map(([group, perms]) => (
                                <div key={group} className="space-y-3">
                                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{group}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {perms.map((p) => (
                                            <div key={p.id} className="flex items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm hover:bg-muted/50 transition-colors">
                                                <Checkbox 
                                                    id={p.id} 
                                                    checked={data.permissions.includes(p.id)}
                                                    onCheckedChange={(checked) => togglePermission(p.id, checked === true)}
                                                />
                                                <div className="grid gap-1.5 leading-none cursor-pointer" onClick={() => togglePermission(p.id, !data.permissions.includes(p.id))}>
                                                    <label
                                                        htmlFor={p.id}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                    >
                                                        {p.name}
                                                    </label>
                                                    <p className="text-xs text-muted-foreground">
                                                        Allows user to {p.name.toLowerCase()}.
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-6">
                        <Button variant="ghost" asChild>
                            <Link href={route('roles.index')}>
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            {isEditing ? 'Update Role' : 'Create Role'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </ConfigurationLayout>
    );
}
