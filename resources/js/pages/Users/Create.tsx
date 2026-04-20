import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save, X, LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Warehouse {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
}

interface Props {
    warehouses: Warehouse[];
    roles: Role[];
}

const breadcrumbs = [
    { title: 'Users', href: '/users' },
    { title: 'Create User', href: '/users/create' },
];

export default function CreateUser({ warehouses, roles }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '',
        warehouse_id: 'none',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-8">
                <div className="flex items-center justify-between">
                    <Heading title="Create User" description="Register a new staff member into the system." />
                </div>

                <div className="max-w-2xl">
                    <form onSubmit={submit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>User Details</CardTitle>
                                <CardDescription>Basic information for the new user account.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="John Doe"
                                        required
                                    />
                                    {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="john@example.com"
                                        required
                                    />
                                    {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                        />
                                        {errors.password && <span className="text-sm text-red-500">{errors.password}</span>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="role_id">Role</Label>
                                        <Select value={data.role_id} onValueChange={(v) => setData('role_id', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map((r) => (
                                                    <SelectItem key={r.id} value={r.id.toString()}>
                                                        {r.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.role_id && <span className="text-sm text-red-500">{errors.role_id}</span>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="warehouse_id">Assigned Warehouse (Optional)</Label>
                                        <Select value={data.warehouse_id} onValueChange={(v) => setData('warehouse_id', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="No specific warehouse" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">No specific warehouse</SelectItem>
                                                {warehouses.map((w) => (
                                                    <SelectItem key={w.id} value={w.id.toString()}>
                                                        {w.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t p-6">
                                <Button variant="ghost" asChild>
                                    <Link href="/users">
                                        <X className="mr-2 h-4 w-4" /> Cancel
                                    </Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Create User
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
