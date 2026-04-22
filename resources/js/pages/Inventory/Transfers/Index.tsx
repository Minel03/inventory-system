import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { StockTransfer, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { CheckCircle, Truck } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Stock Transfers', href: '/transfers' }];

const STATUS_STYLES: Record<string, string> = {
    processing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    processed: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    in_transit: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    received: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

interface Props {
    transfers: StockTransfer[];
}

export default function TransfersIndex({ transfers }: Props) {
    function markProcessed(id: number) {
        if (!confirm('Mark this transfer as processed?')) return;
        router.patch(`/transfers/${id}/processed`);
    }

    function markInTransit(id: number) {
        if (!confirm('Mark this transfer as in transit? This will deduct stock from the source warehouse.')) return;
        router.patch(`/transfers/${id}/in-transit`);
    }

    function receive(id: number) {
        if (!confirm('Mark this transfer as received? This will add stock to the destination warehouse.')) return;
        router.patch(`/transfers/${id}/receive`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Transfers" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Stock Transfers" description="Track and manage internal inventory movements between warehouses." />
                </div>

                <Card>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr className="border-b">
                                    <th className="h-10 px-4 text-left font-medium">Date</th>
                                    <th className="h-10 px-4 text-left font-medium">Item</th>
                                    <th className="h-10 px-4 text-left font-medium">From</th>
                                    <th className="h-10 px-4 text-left font-medium">To</th>
                                    <th className="h-10 px-4 text-right font-medium">Quantity</th>
                                    <th className="h-10 px-4 text-center font-medium">Status</th>
                                    <th className="h-10 px-4 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transfers.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                            No transfers found.
                                        </td>
                                    </tr>
                                )}
                                {transfers.map((t) => (
                                    <tr key={t.id} className="border-b hover:bg-muted/50">
                                        <td className="p-4">{new Date(t.created_at).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <div className="font-medium">{t.item?.name}</div>
                                            <div className="text-xs text-muted-foreground font-mono">{t.item?.sku}</div>
                                        </td>
                                        <td className="p-4">{(t.from_warehouse as any)?.name}</td>
                                        <td className="p-4">{(t.to_warehouse as any)?.name}</td>
                                        <td className="p-4 text-right font-mono font-bold">{t.quantity}</td>
                                        <td className="p-4 text-center">
                                            <Badge className={STATUS_STYLES[t.status] || ''} variant="outline">
                                                {t.status.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-right">
                                            {t.status === 'processing' && (
                                                <Button size="sm" variant="outline" onClick={() => markProcessed(t.id)}>
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Mark Processed
                                                </Button>
                                            )}
                                            {t.status === 'processed' && (
                                                <Button size="sm" variant="outline" onClick={() => markInTransit(t.id)}>
                                                    <Truck className="mr-2 h-4 w-4" />
                                                    Mark In Transit
                                                </Button>
                                            )}
                                            {t.status === 'in_transit' && (
                                                <Button size="sm" onClick={() => receive(t.id)}>
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Mark Received
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
