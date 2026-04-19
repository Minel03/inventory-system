import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Item, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Props {
    items: Item[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Items',
        href: '/items',
    },
];

export default function Index({ items }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this item?')) {
            destroy(`/items/${id}`);
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Items" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Items" description="Manage your inventory items and stock levels." />
                    <Button asChild>
                        <Link href="/items/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Item
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Inventory List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                        <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Name</th>
                                        <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Category</th>
                                        <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Unit</th>
                                        <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">SKU</th>
                                        <th className="text-muted-foreground h-12 px-4 text-right align-middle font-medium">Unit Cost</th>
                                        <th className="text-muted-foreground h-12 px-4 text-center align-middle font-medium">VAT</th>
                                        <th className="text-muted-foreground h-12 px-4 text-right align-middle font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {items.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-muted-foreground p-4 text-center">
                                                No items found.
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((item) => (
                                            <tr key={item.id} className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                                <td className="p-4 align-middle font-medium">{item.name}</td>
                                                <td className="p-4 align-middle">
                                                    {item.category ? (
                                                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
                                                            {item.category.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic">None</span>
                                                    )}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    {item.unit ? (
                                                        <span className="text-xs font-mono">{item.unit.abbreviation}</span>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic">-</span>
                                                    )}
                                                </td>
                                                <td className="p-4 align-middle font-mono text-xs">{item.sku}</td>
                                                <td className="p-4 text-right align-middle font-mono">{formatCurrency(item.unit_cost)}</td>
                                                <td className="p-4 align-middle text-center">
                                                    {item.is_vatable ? (
                                                        <Badge variant="default" className="text-[10px] px-1.5 py-0">VAT</Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Non-VAT</Badge>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right align-middle">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={`/items/${item.id}`}>
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={`/items/${item.id}/edit`}>
                                                                <Edit className="h-4 w-4 text-blue-600" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                                                            <Trash2 className="h-4 w-4 text-red-600" />
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
        </AppLayout>
    );
}
