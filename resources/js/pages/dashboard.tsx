import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Item, StockTransfer } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Banknote, FileText, Package, TrendingUp, Truck } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Analytics',
        href: '/dashboard',
    },
];

interface DashboardProps {
    stats: {
        total_items: number;
        total_warehouses: number;
        pending_prs: number;
        active_transfers: number;
    };
    analytics: {
        total_inventory_value: number;
        low_stock_items: (Item & { global_stock: number })[];
        top_moving_items: (Item & { global_stock: number; volume_30d: number })[];
        recent_transfers: (StockTransfer & { from_warehouse?: any; to_warehouse?: any })[];
    };
}

export default function Dashboard({ stats, analytics }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Analytics</h1>
                    <p className="text-muted-foreground mt-2">Welcome back! Here's an overview of your inventory system.</p>
                </div>

                {/* Top Stats Row */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
                            <Banknote className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ₱{analytics.total_inventory_value.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </div>
                            <p className="text-muted-foreground text-xs">Estimated stock value</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                            <Package className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_items}</div>
                            <p className="text-muted-foreground text-xs">Unique items tracked</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Pending PRs</CardTitle>
                            <FileText className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_prs}</div>
                            <p className="text-muted-foreground text-xs">Awaiting approval or PO creation</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active Transfers</CardTitle>
                            <Truck className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_transfers}</div>
                            <p className="text-muted-foreground text-xs">Stock currently in transit</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Second Row: Low Stock & Top Moving */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                Low Stock Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analytics.low_stock_items.length === 0 ? (
                                    <p className="text-muted-foreground text-sm">No low stock items found.</p>
                                ) : (
                                    analytics.low_stock_items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{item.name}</span>
                                                <span className="text-muted-foreground font-mono text-xs">{item.sku}</span>
                                            </div>
                                            <Badge variant="destructive" className="font-bold">
                                                {item.global_stock} Left
                                            </Badge>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                                Top Moving Items (30 Days)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analytics.top_moving_items.length === 0 ? (
                                    <p className="text-muted-foreground text-sm">No recent item movement.</p>
                                ) : (
                                    analytics.top_moving_items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{item.name}</span>
                                                <span className="text-muted-foreground font-mono text-xs">{item.sku}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-muted-foreground flex flex-col items-end text-xs">
                                                    <span>Stock: {item.global_stock}</span>
                                                </div>
                                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                    Vol: {item.volume_30d}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Third Row: Recent Transfers & Quick Links */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-full lg:col-span-5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5 text-blue-500" />
                                Recent Transfers
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto p-0">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr className="border-b">
                                        <th className="h-10 px-4 text-left font-medium">Ref Number</th>
                                        <th className="h-10 px-4 text-left font-medium">Route</th>
                                        <th className="h-10 px-4 text-center font-medium">Status</th>
                                        <th className="h-10 px-4 text-right font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.recent_transfers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-muted-foreground p-4 text-center">
                                                No recent transfers found.
                                            </td>
                                        </tr>
                                    ) : (
                                        analytics.recent_transfers.map((transfer) => (
                                            <tr key={transfer.id} className="hover:bg-muted/50 border-b last:border-0">
                                                <td className="p-4 font-mono">{`TRF-${transfer.id}`}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="max-w-[120px] truncate">{transfer.from_warehouse?.name || 'Unknown'}</span>
                                                        <ArrowRight className="text-muted-foreground h-3 w-3" />
                                                        <span className="max-w-[120px] truncate font-medium">
                                                            {transfer.to_warehouse?.name || 'Unknown'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <Badge variant="outline" className="text-[10px] uppercase">
                                                        {transfer.status.replace('_', ' ')}
                                                    </Badge>
                                                </td>
                                                <td className="text-muted-foreground p-4 text-right text-xs">
                                                    {new Date(transfer.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    <Card className="col-span-full lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Quick Links</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            <Link
                                href={route('purchases.create')}
                                className="hover:bg-muted/50 flex items-center rounded-lg border p-3 transition-colors"
                            >
                                <FileText className="mr-3 h-4 w-4 text-blue-500" />
                                <div>
                                    <h4 className="text-sm font-semibold">New Requisition</h4>
                                </div>
                            </Link>
                            <Link
                                href={route('transfers.index')}
                                className="hover:bg-muted/50 flex items-center rounded-lg border p-3 transition-colors"
                            >
                                <Truck className="mr-3 h-4 w-4 text-green-500" />
                                <div>
                                    <h4 className="text-sm font-semibold">Manage Transfers</h4>
                                </div>
                            </Link>
                            <Link href={route('items.index')} className="hover:bg-muted/50 flex items-center rounded-lg border p-3 transition-colors">
                                <Package className="mr-3 h-4 w-4 text-orange-500" />
                                <div>
                                    <h4 className="text-sm font-semibold">Manage Items</h4>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function ArrowRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}
