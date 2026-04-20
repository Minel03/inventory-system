import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { usePermission } from '@/hooks/use-permission';
import { Purchase, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Eye, Plus } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Purchases', href: '/purchases' }];

const PR_STATUS_STYLES: Record<string, string> = {
    pending:   'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const PO_STATUS_STYLES: Record<string, string> = {
    po_draft:  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    ordered:   'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    received:  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    partially_received: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const PO_STATUS_LABELS: Record<string, string> = {
    po_draft:  'Draft — Awaiting Supplier',
    ordered:   'Ordered',
    received:  'Received',
    partially_received: 'Partially Received',
    cancelled: 'Cancelled',
};

interface Props {
    requisitions: Purchase[];
    orders: Purchase[];
}

function PurchaseTable({ rows, type }: { rows: Purchase[]; type: 'pr' | 'po' }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm min-w-[800px] md:min-w-0">
                <thead>
                    <tr className="border-b">
                        <th className="text-muted-foreground h-12 px-4 text-left font-medium w-[120px] md:w-36">
                            {type === 'pr' ? 'PR Number' : 'PO Number'}
                        </th>
                        {type === 'po' && (
                            <th className="text-muted-foreground h-12 px-4 text-left font-medium w-32 hidden lg:table-cell">Ref PR</th>
                        )}
                        <th className="text-muted-foreground h-12 px-4 text-left font-medium hidden sm:table-cell">Destination</th>
                        <th className="text-muted-foreground h-12 px-4 text-left font-medium">
                            {type === 'pr' ? 'Items' : 'Supplier'}
                        </th>
                        <th className="text-muted-foreground h-12 px-4 text-left font-medium">Total</th>
                        <th className="text-muted-foreground h-12 px-4 text-left font-medium">Status</th>
                        <th className="text-muted-foreground h-12 px-4 text-left font-medium hidden md:table-cell">Date</th>
                        <th className="text-muted-foreground h-12 px-4 text-right font-medium"></th>
                    </tr>
                </thead>
            <tbody>
                {rows.length === 0 ? (
                    <tr>
                        <td colSpan={type === 'po' ? 8 : 7} className="p-8 text-center text-muted-foreground italic">
                            No {type === 'pr' ? 'requisitions' : 'purchase orders'} found.
                        </td>
                    </tr>
                ) : (
                    rows.map(p => {
                        const total = p.items?.reduce((s, l) => s + l.quantity * l.price, 0) ?? 0;
                        const statusStyles = type === 'pr' ? PR_STATUS_STYLES : PO_STATUS_STYLES;
                        const statusLabel  = type === 'pr'
                            ? (p.status === 'pending' ? 'Pending Approval' : 'Cancelled')
                            : PO_STATUS_LABELS[p.status] ?? p.status;

                        return (
                            <tr key={p.id} className="border-b hover:bg-muted/50 transition-colors">
                                <td className="p-4 font-mono text-sm font-semibold">
                                    {type === 'pr' ? p.pr_number : p.po_number}
                                </td>
                                {type === 'po' && (
                                    <td className="p-4 font-mono text-xs text-muted-foreground hidden lg:table-cell">{p.pr_number}</td>
                                )}
                                <td className="p-4 hidden sm:table-cell">{p.warehouse?.name ?? '—'}</td>
                                <td className="p-4">
                                    {type === 'pr'
                                        ? <span>{p.items?.length ?? 0} line(s)</span>
                                        : <span>{p.supplier?.name ?? <em className="text-muted-foreground text-xs italic">Not assigned</em>}</span>
                                    }
                                </td>
                                <td className="p-4 font-mono">
                                    ₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[p.status] ?? ''}`}>
                                        {statusLabel}
                                    </span>
                                </td>
                                <td className="p-4 text-muted-foreground text-xs whitespace-nowrap hidden md:table-cell">
                                    {new Date(p.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/purchases/${p.id}`}><Eye className="h-4 w-4" /></Link>
                                    </Button>
                                </td>
                            </tr>
                        );
                    })
                )}
            </tbody>
        </table>
        </div>
    );
}

export default function PurchasesIndex({ requisitions, orders }: Props) {
    const [tab, setTab] = useState<'pr' | 'po'>('pr');
    const { can } = usePermission();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Purchases" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Purchases" description="Manage requisitions and purchase orders" />
                    {can('create_pr') && (
                        <Button asChild>
                            <Link href="/purchases/create">
                                <Plus className="mr-2 h-4 w-4" /> New Requisition
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b">
                    <button
                        onClick={() => setTab('pr')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            tab === 'pr'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Purchase Requisitions
                        <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">{requisitions.length}</span>
                    </button>
                    <button
                        onClick={() => setTab('po')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            tab === 'po'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Purchase Orders
                        <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">{orders.length}</span>
                    </button>
                </div>

                {/* Table */}
                <Card>
                    <CardContent className="p-0 overflow-auto">
                        {tab === 'pr'
                            ? <PurchaseTable rows={requisitions} type="pr" />
                            : <PurchaseTable rows={orders} type="po" />
                        }
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
