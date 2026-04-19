import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Warehouse, type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { Edit, Plus, Trash2, Home, Eye } from 'lucide-react';
import { useState } from 'react';

interface Props {
    warehouses: Warehouse[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Warehouses',
        href: '/warehouses',
    },
];

export default function Warehouses({ warehouses }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);

    const hasMainWarehouse = warehouses.some(w => w.is_main);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        address: '',
        is_main: false as boolean,
    });

    const openCreateModal = () => {
        setEditingWarehouse(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (warehouse: Warehouse) => {
        setEditingWarehouse(warehouse);
        setData({
            name: warehouse.name,
            address: warehouse.address || '',
            is_main: warehouse.is_main,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingWarehouse) {
            put(`/warehouses/${editingWarehouse.id}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/warehouses', {
                onSuccess: () => {
                    reset();
                    closeModal();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this warehouse?')) {
            destroy(`/warehouses/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Warehouses" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Warehouses" description="Manage your warehouse locations." />
                    <Button onClick={openCreateModal}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Warehouse
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Warehouse List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="hover:bg-muted/50 border-b transition-colors whitespace-nowrap">
                                        <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Name</th>
                                        <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Type</th>
                                        <th className="text-muted-foreground h-12 px-4 text-right align-middle font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {warehouses.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-4 text-center text-muted-foreground">
                                                No warehouses found. Add your first warehouse.
                                            </td>
                                        </tr>
                                    ) : (
                                        warehouses.map((warehouse) => (
                                            <tr key={warehouse.id} className="hover:bg-muted/50 border-b transition-colors">
                                                <td className="p-4 align-middle font-medium">
                                                    <div className="flex items-center gap-2">
                                                        {warehouse.name}
                                                        {warehouse.is_main && <Home className="h-4 w-4 text-blue-500" />}
                                                    </div>
                                                    {warehouse.address && <div className="text-xs text-muted-foreground truncate max-w-xs">{warehouse.address}</div>}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    {warehouse.is_main ? (
                                                        <Badge variant="default" className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200">Main</Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="text-xs">Sub</Badge>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right align-middle">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={`/warehouses/${warehouse.id}`}><Eye className="h-4 w-4" /></Link>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => openEditModal(warehouse)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                                                            onClick={() => handleDelete(warehouse.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}</DialogTitle>
                        <DialogDescription>
                            {editingWarehouse ? 'Update the warehouse information below.' : 'Enter the details of the new warehouse.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Warehouse Name</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">Full Address</Label>
                                <Input id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} required />
                                {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                            </div>
                            {(!hasMainWarehouse || editingWarehouse?.is_main) && (
                                <>
                                    <div className="flex items-center space-x-2 pt-2">
                                        <Checkbox
                                            id="is_main"
                                            checked={data.is_main}
                                            onCheckedChange={(checked) => setData('is_main', checked === true)}
                                        />
                                        <Label htmlFor="is_main" className="font-normal text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Set as Main Warehouse
                                        </Label>
                                    </div>
                                    <div className="text-xs text-muted-foreground italic">Note: There can be only one main warehouse.</div>
                                    {errors.is_main && <p className="text-xs text-red-500">{errors.is_main}</p>}
                                </>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {editingWarehouse ? 'Save Changes' : 'Add Warehouse'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
