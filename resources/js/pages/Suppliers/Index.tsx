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
import { Supplier, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
    suppliers: Supplier[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Suppliers',
        href: '/suppliers',
    },
];

export default function Suppliers({ suppliers }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        contact_person: '',
        phone: '',
        email: '',
        address: '',
        is_vatable: false as boolean,
    });

    const openCreateModal = () => {
        setEditingSupplier(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setData({
            name: supplier.name,
            contact_person: supplier.contact_person,
            phone: supplier.phone,
            email: supplier.email || '',
            address: supplier.address || '',
            is_vatable: supplier.is_vatable,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSupplier) {
            put(`/suppliers/${editingSupplier.id}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/suppliers', {
                onSuccess: () => {
                    reset();
                    closeModal();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this supplier?')) {
            destroy(`/suppliers/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Suppliers" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Suppliers" description="Manage your product suppliers and contact information." />
                    <Button onClick={openCreateModal}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Supplier
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Supplier List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="hover:bg-muted/50 border-b transition-colors whitespace-nowrap">
                                        <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Name</th>
                                        <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Contact Person</th>
                                        <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Phone</th>
                                        <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Email</th>
                                        <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">VAT</th>
                                        <th className="text-muted-foreground h-12 px-4 text-right align-middle font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {suppliers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                                No suppliers found. Add your first supplier to get started.
                                            </td>
                                        </tr>
                                    ) : (
                                        suppliers.map((supplier) => (
                                            <tr key={supplier.id} className="hover:bg-muted/50 border-b transition-colors">
                                                <td className="p-4 align-middle font-medium">
                                                    <div>{supplier.name}</div>
                                                    {supplier.address && <div className="text-xs text-muted-foreground truncate max-w-xs">{supplier.address}</div>}
                                                </td>
                                                <td className="p-4 align-middle">{supplier.contact_person}</td>
                                                <td className="p-4 align-middle">{supplier.phone}</td>
                                                <td className="p-4 align-middle">{supplier.email || '-'}</td>
                                                <td className="p-4 align-middle">
                                                    {supplier.is_vatable ? (
                                                        <Badge variant="default" className="text-xs">VAT</Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="text-xs">Non-VAT</Badge>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right align-middle">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => openEditModal(supplier)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                                                            onClick={() => handleDelete(supplier.id)}
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
                        <DialogTitle>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
                        <DialogDescription>
                            {editingSupplier ? 'Update the supplier information below.' : 'Enter the details of the new supplier.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Supplier Name</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="contact_person">Contact Person</Label>
                                <Input id="contact_person" value={data.contact_person} onChange={(e) => setData('contact_person', e.target.value)} required />
                                {errors.contact_person && <p className="text-xs text-red-500">{errors.contact_person}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} required />
                                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address (Optional)</Label>
                                <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">Address (Optional)</Label>
                                <Input id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} />
                                {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    id="is_vatable_supplier"
                                    checked={data.is_vatable}
                                    onCheckedChange={(checked) => setData('is_vatable', checked === true)}
                                />
                                <Label htmlFor="is_vatable_supplier" className="font-normal text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    VAT Registered Supplier
                                </Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {editingSupplier ? 'Save Changes' : 'Add Supplier'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
