import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Warehouse, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Box, MapPin, AlertCircle } from 'lucide-react';

interface Props {
    warehouse: Warehouse;
}

export default function WarehouseShow({ warehouse }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Warehouses', href: '/warehouses' },
        { title: warehouse.name, href: `/warehouses/${warehouse.id}` },
    ];

    const uniqueItemsCount = warehouse.items?.length || 0;
    const totalPhysicalUnits = warehouse.items?.reduce((sum, w_item) => sum + w_item.quantity, 0) || 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Warehouse: ${warehouse.name}`} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/warehouses"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <Heading title={warehouse.name} description="Current inventory profile" />
                            {warehouse.is_main && <Badge className="mb-4">Main Warehouse</Badge>}
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unique Items Stored</CardTitle>
                            <Box className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{uniqueItemsCount} SKUs</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Physical Units</CardTitle>
                            <Box className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalPhysicalUnits} units</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Address</CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm">{warehouse.address}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Inventory List</CardTitle>
                        <CardDescription>All items currently stocked in {warehouse.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="hover:bg-muted/50 border-b transition-colors whitespace-nowrap">
                                        <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Item Name</th>
                                        <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">SKU</th>
                                        <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Category</th>
                                        <th className="text-muted-foreground h-12 px-4 text-right align-middle font-medium">Quantity Available</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {!warehouse.items || warehouse.items.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center justify-center">
                                                    <AlertCircle className="h-8 w-8 mb-2 text-muted-foreground/50" />
                                                    <p>This warehouse is currently empty.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        warehouse.items.map((w_item) => (
                                            <tr key={w_item.id} className="hover:bg-muted/50 border-b transition-colors">
                                                <td className="p-4 align-middle font-medium">
                                                    <Link href={`/items/${w_item.item_id}`} className="hover:underline text-blue-600 dark:text-blue-400">
                                                        {w_item.item?.name}
                                                    </Link>
                                                </td>
                                                <td className="p-4 align-middle font-mono text-xs">{w_item.item?.sku}</td>
                                                <td className="p-4 align-middle text-muted-foreground">{w_item.item?.category?.name || 'Uncategorized'}</td>
                                                <td className={`p-4 text-right align-middle font-mono font-bold ${w_item.quantity <= 0 ? 'text-red-500' : ''}`}>
                                                    {w_item.quantity} {w_item.item?.unit?.abbreviation}
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
