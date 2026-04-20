import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Purchase, SharedData, Supplier, Warehouse, type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle,
    ClipboardList,
    FileText,
    PackageCheck,
    Printer,
    ShoppingBag,
    Truck,
    UserCheck,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    po_draft: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    awaiting_l1: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    awaiting_l2: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    ordered: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    transferring: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    partially_received: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    received: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending Approval',
    po_draft: 'Draft PO — Awaiting Supplier',
    awaiting_l1: 'Awaiting Level 1 Sign-off',
    awaiting_l2: 'Awaiting Level 2 Sign-off',
    ordered: 'Ordered',
    transferring: 'Transferring from Main',
    partially_received: 'Partially Received',
    received: 'Fully Received',
    cancelled: 'Cancelled',
};

interface Props {
    purchase: Purchase;
    suppliers: Supplier[];
    mainWarehouse?: Warehouse;
    mainWarehouseStock?: Record<number, number>;
}

export default function PurchaseShow({ purchase, suppliers, mainWarehouse, mainWarehouseStock = {} }: Props) {
    const { auth } = usePage<SharedData>().props;
    const userRole: string = (auth.user as { role?: string })?.role ?? '';

    const isPR = purchase.status === 'pending' || (purchase.status === 'cancelled' && !purchase.po_number);
    const documentLabel = isPR ? (purchase.pr_number ?? `PR #${purchase.id}`) : (purchase.po_number ?? `PO #${purchase.id}`);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Purchases', href: '/purchases' },
        { title: documentLabel, href: `/purchases/${purchase.id}` },
    ];

    const [selectedSupplier, setSelectedSupplier] = useState('');

    // GR form state
    const { data, setData, patch, processing } = useForm<{
        received: { line_id: number; quantity: number }[];
    }>({
        received: (purchase.items ?? []).map((l) => ({
            line_id: l.id,
            quantity: l.quantity - l.quantity_received,
        })),
    });

    function initiateTransfer(piId: number, itemId: number, maxQty: number) {
        const qty = prompt(`Enter quantity to transfer from ${mainWarehouse?.name} (Max: ${maxQty}):`, maxQty.toString());
        if (!qty || isNaN(parseInt(qty))) return;

        const quantity = Math.min(parseInt(qty), maxQty);

        router.post(
            '/transfers',
            {
                item_id: itemId,
                from_warehouse: mainWarehouse?.id,
                to_warehouse: purchase.warehouse_id,
                quantity: quantity,
                purchase_item_id: piId,
            },
            {
                onSuccess: () => alert('Transfer initiated successfully.'),
            },
        );
    }

    function updateReceived(index: number, value: string) {
        const updated = [...data.received];
        updated[index] = { ...updated[index], quantity: parseInt(value) || 0 };
        setData('received', updated);
    }

    const total = purchase.items?.reduce((sum, l) => sum + l.quantity * l.price, 0) ?? 0;

    function approve() {
        router.patch(`/purchases/${purchase.id}/approve`);
    }
    function approveL1() {
        router.patch(`/purchases/${purchase.id}/approve-l1`);
    }
    function approveL2() {
        router.patch(`/purchases/${purchase.id}/approve-l2`);
    }

    function assignSupplier() {
        if (!selectedSupplier) return;
        router.patch(`/purchases/${purchase.id}/assign-supplier`, { supplier_id: selectedSupplier });
    }

    function submitReceipt(e: React.FormEvent) {
        e.preventDefault();
        patch(`/purchases/${purchase.id}/receive`);
    }

    function cancel() {
        if (!confirm('Cancel this document?')) return;
        router.patch(`/purchases/${purchase.id}/cancel`);
    }

    const isReceivable = purchase.status === 'ordered' || purchase.status === 'partially_received' || purchase.status === 'transferring';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={documentLabel} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-start gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/purchases">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                            {isPR ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                    <ClipboardList className="h-3 w-3" /> Purchase Requisition
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                    <FileText className="h-3 w-3" /> Purchase Order
                                </span>
                            )}
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[purchase.status] ?? ''}`}
                            >
                                {STATUS_LABELS[purchase.status] ?? purchase.status}
                            </span>
                        </div>
                        <Heading
                            title={documentLabel}
                            description={`Destination: ${purchase.warehouse?.name ?? '—'} • Created ${new Date(purchase.created_at).toLocaleDateString()} ${purchase.expected_delivery_date ? `• Expected: ${new Date(purchase.expected_delivery_date).toLocaleDateString()}` : ''}`}
                        />
                        {purchase.pr_number && purchase.po_number && (
                            <p className="text-muted-foreground -mt-2 text-xs">
                                <span className="font-medium">PR:</span> {purchase.pr_number} → <span className="font-medium">PO:</span>{' '}
                                {purchase.po_number}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                const printWindow = window.open(`/purchases/${purchase.id}/print`, '_blank');
                                if (!printWindow) {
                                    // Fallback if popup is blocked
                                    window.location.href = `/purchases/${purchase.id}/print`;
                                }
                            }}
                        >
                            <Printer className="mr-2 h-4 w-4" />
                            Print Receipt
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Line Items / GR Table */}
                    <div className="flex flex-col gap-4 md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>{isReceivable ? 'Goods Receipt' : 'Line Items'}</CardTitle>
                                <CardDescription>
                                    {purchase.supplier ? `Supplier: ${purchase.supplier.name}` : 'No supplier assigned yet.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="overflow-x-auto p-0">
                                <form id="gr-form" onSubmit={submitReceipt}>
                                    <table className="w-full min-w-[600px] text-sm md:min-w-0">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-muted-foreground h-10 px-4 text-left font-medium">Item</th>
                                                <th className="text-muted-foreground hidden h-10 px-4 text-right font-medium sm:table-cell">
                                                    Requested
                                                </th>
                                                <th className="text-muted-foreground h-10 px-4 text-right font-medium">Internal Transfer</th>
                                                <th className="text-muted-foreground h-10 px-4 text-right font-medium">Ordered (PO)</th>
                                                <th className="text-muted-foreground h-10 px-4 text-right font-medium">Received</th>
                                                <th className="text-muted-foreground hidden h-10 px-4 text-right font-medium md:table-cell">
                                                    Unfulfilled
                                                </th>
                                                <th className="text-muted-foreground h-10 px-4 text-right font-medium">Subtotal</th>
                                                {isReceivable && (
                                                    <th className="text-muted-foreground h-10 w-28 px-4 text-right font-medium">Deliver Now</th>
                                                )}
                                                {purchase.status === 'pending' && mainWarehouse && (
                                                    <th className="text-muted-foreground h-10 px-4 text-right font-medium">Sourcing</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {purchase.items?.map((line, idx) => {
                                                const totalSourced = line.quantity_transferred + line.quantity_received;
                                                const remaining = line.quantity - totalSourced;
                                                const isFulfilled = remaining <= 0;
                                                const stockInMain = mainWarehouseStock[line.item_id] || 0;
                                                const canTransfer =
                                                    purchase.status === 'pending' && stockInMain > 0 && line.quantity_transferred < line.quantity;

                                                return (
                                                    <tr key={line.id} className={`hover:bg-muted/50 border-b ${isFulfilled ? 'opacity-50' : ''}`}>
                                                        <td className="p-4">
                                                            <div className="font-medium">{line.item?.name}</div>
                                                            <div className="text-muted-foreground font-mono text-xs">{line.item?.sku}</div>
                                                        </td>
                                                        <td className="hidden p-4 text-right font-mono sm:table-cell">
                                                            {line.quantity} {line.item?.unit?.abbreviation}
                                                        </td>
                                                        <td className="p-4 text-right font-mono">
                                                            {line.quantity_transferred > 0 ? (
                                                                <span className="font-medium text-blue-600 dark:text-blue-400">
                                                                    {line.quantity_transferred}
                                                                </span>
                                                            ) : (
                                                                '—'
                                                            )}
                                                        </td>
                                                        <td className="p-4 text-right font-mono">
                                                            {line.quantity_ordered > 0 ? (
                                                                <span className="font-medium text-purple-600 dark:text-purple-400">
                                                                    {line.quantity_ordered}
                                                                </span>
                                                            ) : purchase.status === 'pending' ? (
                                                                'TBD'
                                                            ) : (
                                                                '—'
                                                            )}
                                                        </td>
                                                        <td className="p-4 text-right font-mono text-green-600 dark:text-green-400">
                                                            {line.quantity_received}
                                                        </td>
                                                        <td
                                                            className={`hidden p-4 text-right font-mono font-semibold md:table-cell ${remaining > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-muted-foreground'}`}
                                                        >
                                                            {remaining > 0 ? remaining : '—'}
                                                        </td>
                                                        <td className="p-4 text-right font-mono font-semibold">
                                                            ₱{(line.quantity * line.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                        </td>
                                                        {isReceivable && (
                                                            <td className="p-4 text-right">
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    max={line.quantity_ordered - line.quantity_received}
                                                                    value={data.received[idx]?.quantity ?? 0}
                                                                    onChange={(e) => updateReceived(idx, e.target.value)}
                                                                    disabled={isFulfilled}
                                                                    className="w-20 text-right font-mono"
                                                                />
                                                            </td>
                                                        )}
                                                        {purchase.status === 'pending' && mainWarehouse && (
                                                            <td className="p-4 text-right">
                                                                {canTransfer ? (
                                                                    <div className="flex flex-col items-end gap-1">
                                                                        <span className="text-[10px] font-bold text-green-600 uppercase">
                                                                            {stockInMain} in Stock
                                                                        </span>
                                                                        <Button
                                                                            type="button"
                                                                            size="sm"
                                                                            variant="outline"
                                                                            className="h-7 px-2 text-[10px]"
                                                                            onClick={() =>
                                                                                initiateTransfer(
                                                                                    line.id,
                                                                                    line.item_id,
                                                                                    Math.min(stockInMain, line.quantity - line.quantity_transferred),
                                                                                )
                                                                            }
                                                                        >
                                                                            <Truck className="mr-1 h-3 w-3" /> Transfer
                                                                        </Button>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-muted-foreground text-[10px] italic">No Stock in Main</span>
                                                                )}
                                                            </td>
                                                        )}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                        <tfoot>
                                            <tr className="border-t">
                                                <td colSpan={isReceivable ? 5 : 4} className="p-4 text-right text-sm font-semibold">
                                                    Total
                                                </td>
                                                <td className="p-4 text-right font-mono text-lg font-bold">
                                                    ₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                </td>
                                                {isReceivable && <td />}
                                            </tr>
                                        </tfoot>
                                    </table>
                                </form>
                            </CardContent>
                        </Card>

                        {purchase.notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Notes / Reason</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm">{purchase.notes}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Action Panel */}
                    <div className="flex flex-col gap-4">
                        {/* PR — Approve */}
                        {purchase.status === 'pending' && (
                            <Card className="border-yellow-300 dark:border-yellow-700">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="h-4 w-4 text-yellow-500" /> Manager: Approve
                                    </CardTitle>
                                    <CardDescription>Approving will generate a Draft PO with a PO number.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2">
                                    <Button id="btn-approve-pr" onClick={approve} className="w-full">
                                        <CheckCircle className="mr-2 h-4 w-4" /> Approve & Generate PO
                                    </Button>
                                    <Button id="btn-reject-pr" variant="destructive" onClick={cancel} className="w-full">
                                        <XCircle className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* PO Draft — Assign Supplier */}
                        {purchase.status === 'po_draft' && (
                            <Card className="border-blue-300 dark:border-blue-700">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-sm">
                                        <ShoppingBag className="h-4 w-4 text-blue-500" /> Buyer: Assign Supplier
                                    </CardTitle>
                                    <CardDescription>
                                        PO <strong className="font-mono">{purchase.po_number}</strong> is ready. Select a supplier.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-3">
                                    <select
                                        id="supplier-select"
                                        className="border-input focus:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus:ring-1 focus:outline-none"
                                        value={selectedSupplier}
                                        onChange={(e) => setSelectedSupplier(e.target.value)}
                                    >
                                        <option value="">— Select Supplier —</option>
                                        {suppliers.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                    <Button id="btn-assign-supplier" onClick={assignSupplier} disabled={!selectedSupplier} className="w-full">
                                        <ShoppingBag className="mr-2 h-4 w-4" /> Assign Supplier
                                    </Button>
                                    <Button id="btn-cancel-po-draft" variant="destructive" onClick={cancel} className="w-full">
                                        <XCircle className="mr-2 h-4 w-4" /> Cancel PO
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Level 1 Approval */}
                        {purchase.status === 'awaiting_l1' && (
                            <Card className="border-indigo-300 dark:border-indigo-700">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-sm">
                                        <UserCheck className="h-4 w-4 text-indigo-500" /> Level 1 Sign-off
                                    </CardTitle>
                                    <CardDescription>Review internal costs and supplier selection.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2">
                                    {userRole === 'approver_l1' || userRole === 'admin' ? (
                                        <>
                                            <Button id="btn-approve-l1" onClick={approveL1} className="w-full bg-indigo-600 hover:bg-indigo-700">
                                                <CheckCircle className="mr-2 h-4 w-4" /> Sign-off Level 1
                                            </Button>
                                            <Button id="btn-reject-l1" variant="destructive" onClick={cancel} className="w-full">
                                                <XCircle className="mr-2 h-4 w-4" /> Reject Order
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="bg-muted text-muted-foreground rounded-md p-3 text-xs italic">
                                            Waiting for Level 1 Approver to sign off.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Level 2 Approval */}
                        {purchase.status === 'awaiting_l2' && (
                            <Card className="border-pink-300 dark:border-pink-700">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-sm">
                                        <UserCheck className="h-4 w-4 text-pink-500" /> Level 2 Sign-off
                                    </CardTitle>
                                    <CardDescription>Final management sign-off before official order release.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2">
                                    {userRole === 'approver_l2' || userRole === 'admin' ? (
                                        <>
                                            <Button id="btn-approve-l2" onClick={approveL2} className="w-full bg-pink-600 hover:bg-pink-700">
                                                <CheckCircle className="mr-2 h-4 w-4" /> Sign-off Level 2
                                            </Button>
                                            <Button id="btn-reject-l2" variant="destructive" onClick={cancel} className="w-full">
                                                <XCircle className="mr-2 h-4 w-4" /> Reject Order
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="bg-muted text-muted-foreground rounded-md p-3 text-xs italic">
                                            Waiting for Level 2 Approver to sign off.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Approval Footprints (Historical) */}
                        {(purchase.l1_approved_at || purchase.l2_approved_at) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-muted-foreground text-center text-xs font-bold tracking-wider uppercase">
                                        Signatures
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-3 py-2">
                                    {purchase.l1_approved_at && (
                                        <div className="flex items-start gap-2 border-b pb-2 text-xs">
                                            <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                                            <div>
                                                <p className="font-bold">Level 1 Signed</p>
                                                <p>{purchase.l1_approver?.name}</p>
                                                <p className="text-muted-foreground text-[10px]">
                                                    {new Date(purchase.l1_approved_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {purchase.l2_approved_at && (
                                        <div className="flex items-start gap-2 text-xs">
                                            <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                                            <div>
                                                <p className="font-bold">Level 2 Signed</p>
                                                <p>{purchase.l2_approver?.name}</p>
                                                <p className="text-muted-foreground text-[10px]">
                                                    {new Date(purchase.l2_approved_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Ordered / Partial — Goods Receipt */}
                        {isReceivable && (
                            <Card className="border-purple-300 dark:border-purple-700">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-sm">
                                        <PackageCheck className="h-4 w-4 text-purple-500" /> Warehouse: Record Delivery
                                    </CardTitle>
                                    <CardDescription>
                                        Enter how many units actually arrived for each line item. You can receive partially — the PO will stay open
                                        until all items are fulfilled.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2">
                                    {userRole === 'warehouse' || userRole === 'admin' ? (
                                        <>
                                            {purchase.status === 'partially_received' && (
                                                <div className="flex items-start gap-2 rounded-md border border-orange-200 bg-orange-50 p-3 text-xs text-orange-800 dark:border-orange-700 dark:bg-orange-900/20 dark:text-orange-300">
                                                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                                                    <span>Partial delivery recorded.</span>
                                                </div>
                                            )}
                                            <Button
                                                id="btn-record-receipt"
                                                type="submit"
                                                form="gr-form"
                                                disabled={processing}
                                                className="w-full bg-purple-600 text-white hover:bg-purple-700"
                                            >
                                                <PackageCheck className="mr-2 h-4 w-4" />
                                                {processing ? 'Recording…' : 'Record Delivery'}
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="bg-muted text-muted-foreground rounded-md p-3 text-xs italic">
                                            Only Warehouse Staff can record deliveries.
                                        </div>
                                    )}
                                    <Button id="btn-cancel-ordered" variant="destructive" onClick={cancel} className="w-full">
                                        <XCircle className="mr-2 h-4 w-4" /> Cancel PO
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Received */}
                        {purchase.status === 'received' && (
                            <Card className="border-green-300 dark:border-green-700">
                                <CardContent className="flex items-center gap-3 p-4">
                                    <CheckCircle className="h-6 w-6 shrink-0 text-green-500" />
                                    <div>
                                        <p className="text-sm font-semibold">Fully Received</p>
                                        <p className="text-muted-foreground text-xs">All items received in {purchase.warehouse?.name}.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Cancelled */}
                        {purchase.status === 'cancelled' && (
                            <Card className="border-red-300 dark:border-red-700">
                                <CardContent className="flex items-center gap-3 p-4">
                                    <XCircle className="h-6 w-6 shrink-0 text-red-500" />
                                    <div>
                                        <p className="text-sm font-semibold">Cancelled</p>
                                        <p className="text-muted-foreground text-xs">No stock was moved.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
