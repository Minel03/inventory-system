import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Item, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, Box, Copy, TrendingUp, History } from 'lucide-react';

interface Props {
    item: Item;
}

export default function ItemShow({ item }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Items', href: '/items' },
        { title: item.sku, href: `/items/${item.id}` },
    ];

    const totalStock = item.warehouses?.reduce((sum, w) => sum + w.quantity, 0) || 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Item: ${item.name}`} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/items"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div>
                        <Heading title={item.name} description={`SKU: ${item.sku} • Category: ${item.category?.name || 'None'}`} />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Global Stock</CardTitle>
                            <Box className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalStock} {item.unit?.abbreviation}</div>
                            <p className="text-xs text-muted-foreground mt-1">Across all warehouses</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unit Cost</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(item.unit_cost)}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Total Value: {formatCurrency(item.unit_cost * totalStock)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tax Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mt-1">
                                {item.is_vatable ? (
                                    <Badge variant="default" className="text-sm">VAT Registered</Badge>
                                ) : (
                                    <Badge variant="secondary" className="text-sm">Non-VAT</Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Warehouse Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Warehouse Breakdown</CardTitle>
                            <CardDescription>Current stock location</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="hover:bg-muted/50 border-b transition-colors whitespace-nowrap">
                                            <th className="text-muted-foreground h-10 px-4 text-left align-middle font-medium">Warehouse</th>
                                            <th className="text-muted-foreground h-10 px-4 text-right align-middle font-medium">Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {!item.warehouses || item.warehouses.length === 0 ? (
                                            <tr>
                                                <td colSpan={2} className="p-4 text-center text-muted-foreground text-xs italic">
                                                    Item has no stock in any warehouse.
                                                </td>
                                            </tr>
                                        ) : (
                                            item.warehouses.map((w_item) => (
                                                <tr key={w_item.id} className="hover:bg-muted/50 border-b transition-colors">
                                                    <td className="p-3 px-4 align-middle font-medium">
                                                        <Link href={`/warehouses/${w_item.warehouse_id}`} className="hover:underline flex items-center gap-2">
                                                            {w_item.warehouse?.name}
                                                            {w_item.warehouse?.is_main && <Badge variant="secondary" className="text-[10px] px-1 h-4">Main</Badge>}
                                                        </Link>
                                                    </td>
                                                    <td className="p-3 px-4 text-right align-middle font-mono">
                                                        {w_item.quantity} {item.unit?.abbreviation}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stock Ledger / Activity Tracker */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Activity Ledger</CardTitle>
                                <CardDescription>Recent stock movements</CardDescription>
                            </div>
                            <History className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="relative w-full overflow-auto max-h-[300px]">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b sticky top-0 bg-card">
                                        <tr className="hover:bg-muted/50 border-b transition-colors whitespace-nowrap">
                                            <th className="text-muted-foreground h-10 px-4 text-left align-middle font-medium">Date</th>
                                            <th className="text-muted-foreground h-10 px-4 text-left align-middle font-medium">Type</th>
                                            <th className="text-muted-foreground h-10 px-4 text-right align-middle font-medium">Qty</th>
                                            <th className="text-muted-foreground h-10 px-4 text-left align-middle font-medium">Location</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {!item.movements || item.movements.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="p-4 text-center text-muted-foreground text-xs italic">
                                                    No movement history recorded.
                                                </td>
                                            </tr>
                                        ) : (
                                            item.movements.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((movement) => (
                                                <tr key={movement.id} className="hover:bg-muted/50 border-b transition-colors">
                                                    <td className="p-3 px-4 align-middle text-xs whitespace-nowrap">
                                                        {new Date(movement.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-3 px-4 align-middle">
                                                        <Badge variant="outline" className="text-[10px] capitalize">
                                                            {movement.type.replace('_', ' ')}
                                                        </Badge>
                                                    </td>
                                                    <td className={`p-3 px-4 text-right align-middle font-mono font-bold ${movement.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                        {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                                                    </td>
                                                    <td className="p-3 px-4 align-middle text-xs text-muted-foreground">
                                                        {movement.warehouse?.name}
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
            </div>
        </AppLayout>
    );
}
