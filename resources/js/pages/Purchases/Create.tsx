import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Item, Warehouse, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Info, Package, Plus, ShoppingCart, Trash2, Truck, Warehouse as WarehouseIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Purchases', href: '/purchases' },
    { title: 'New Requisition', href: '/purchases/create' },
];

interface LineItem {
    item_id: string;
    quantity: string;
    price: string;
    [key: string]: string;
}

interface Props {
    items: Item[];
    warehouses: Warehouse[];
    mainWarehouseStock: Record<number, number>;
}

export default function PurchasesCreate({ items, warehouses, mainWarehouseStock = {} }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        warehouse_id: string;
        expected_delivery_date: string;
        notes: string;
        items: LineItem[];
    }>({
        warehouse_id: '',
        expected_delivery_date: '',
        notes: '',
        items: [{ item_id: '', quantity: '1', price: '0' }],
    });

    function addLine() {
        setData('items', [...data.items, { item_id: '', quantity: '1', price: '0' }]);
    }

    function removeLine(index: number) {
        setData('items', data.items.filter((_, i) => i !== index));
    }

    function updateLine(index: number, field: keyof LineItem, value: string) {
        const updated = [...data.items];
        updated[index] = { ...updated[index], [field]: value };
        if (field === 'item_id') {
            const selected = items.find(i => i.id === parseInt(value));
            if (selected) updated[index].price = String(selected.unit_cost);
        }
        setData('items', updated);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/purchases');
    }

    // --- Sourcing Logic ---
    const filledLines = data.items.filter(l => l.item_id);

    const internalLines = filledLines.filter(l => {
        const stock = mainWarehouseStock[parseInt(l.item_id)] ?? 0;
        return stock >= parseInt(l.quantity || '1');
    });

    const externalLines = filledLines.filter(l => {
        const stock = mainWarehouseStock[parseInt(l.item_id)] ?? 0;
        return stock < parseInt(l.quantity || '1');
    });

    const externalTotal = externalLines.reduce((sum, l) => {
        const stock = mainWarehouseStock[parseInt(l.item_id)] ?? 0;
        const needed = Math.max(0, parseInt(l.quantity || '0') - stock);
        return sum + needed * parseFloat(l.price || '0');
    }, 0);

    const totalValue = data.items.reduce((sum, l) => {
        return sum + parseFloat(l.quantity || '0') * parseFloat(l.price || '0');
    }, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Requisition" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/purchases"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <Heading title="New Purchase Requisition" description="Request items for a warehouse. The system will automatically source from Main Warehouse stock first." />
                </div>

                {/* How it works banner */}
                <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900/40 dark:bg-blue-950/30">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                        <span className="font-semibold">How sourcing works: </span>
                        Items with available stock in the <strong>Main Warehouse</strong> will be fulfilled via an <strong>Internal Transfer</strong> (no cost). Items without sufficient stock will generate a <strong>Purchase Order</strong> to buy from a supplier.
                    </div>
                </div>

                <form onSubmit={submit} className="grid gap-4 md:grid-cols-3">
                    {/* Left column — metadata + summary */}
                    <div className="md:col-span-1 flex flex-col gap-4">
                        <Card>
                            <CardHeader><CardTitle>Request Details</CardTitle></CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                {/* Destination Warehouse */}
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="warehouse_id">Destination Warehouse *</Label>
                                    <Select value={data.warehouse_id} onValueChange={v => setData('warehouse_id', v)}>
                                        <SelectTrigger id="warehouse_id" className="h-9">
                                            <div className="flex items-center gap-2">
                                                <WarehouseIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                                <SelectValue placeholder="— Select Warehouse —" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {warehouses.map(w => (
                                                <SelectItem key={w.id} value={String(w.id)}>
                                                    {w.name}{w.is_main ? ' (Main)' : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.warehouse_id && <p className="text-xs text-destructive">{errors.warehouse_id}</p>}
                                </div>

                                {/* Expected Delivery Date */}
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="expected_delivery_date">Expected Delivery Date</Label>
                                    <Input
                                        id="expected_delivery_date"
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        className="h-9"
                                        value={data.expected_delivery_date}
                                        onChange={e => setData('expected_delivery_date', e.target.value)}
                                    />
                                    {errors.expected_delivery_date && <p className="text-xs text-destructive">{errors.expected_delivery_date}</p>}
                                </div>

                                {/* Notes */}
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="notes">Notes / Reason</Label>
                                    <textarea
                                        id="notes"
                                        rows={3}
                                        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                                        placeholder="Optional justification or notes..."
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sourcing Summary Card */}
                        <Card className="overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Sourcing Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3 pt-0">
                                {/* Internal Transfers */}
                                <div className="flex items-center gap-3 rounded-md bg-blue-50 border border-blue-200 p-2.5 dark:bg-blue-950/30 dark:border-blue-900/40">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                                        <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">Internal Transfer</p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400">
                                            {internalLines.length} item(s) · <span className="font-bold">No Cost</span>
                                        </p>
                                    </div>
                                </div>

                                {/* External Purchases */}
                                <div className="flex items-center gap-3 rounded-md bg-purple-50 border border-purple-200 p-2.5 dark:bg-purple-950/30 dark:border-purple-900/40">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50">
                                        <ShoppingCart className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-purple-800 dark:text-purple-300">Purchase Order</p>
                                        <p className="text-xs text-purple-600 dark:text-purple-400">
                                            {externalLines.length} item(s) · <span className="font-bold">
                                                ₱{externalTotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t pt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground">Budget Impact</span>
                                        <span className="text-sm font-bold">₱{externalTotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs text-muted-foreground">Total Value</span>
                                        <span className="text-xs text-muted-foreground">₱{totalValue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? 'Submitting…' : 'Submit Requisition'}
                        </Button>
                    </div>

                    {/* Right column — line items */}
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Line Items</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={addLine}>
                                    <Plus className="mr-1 h-3 w-3" /> Add Item
                                </Button>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                {errors.items && <p className="text-xs text-destructive">{errors.items}</p>}

                                {data.items.map((line, idx) => {
                                    const itemId = parseInt(line.item_id);
                                    const stockInMain = line.item_id ? (mainWarehouseStock[itemId] ?? 0) : null;
                                    const qty = parseInt(line.quantity || '1');
                                    const isFullyCovered = stockInMain !== null && stockInMain >= qty;
                                    const isPartiallyCovered = stockInMain !== null && stockInMain > 0 && stockInMain < qty;
                                    const isExternal = stockInMain !== null && stockInMain === 0;

                                    let cardStyle = 'border rounded-lg p-3 bg-muted/20';
                                    let sourcingBadge = null;

                                    if (isFullyCovered) {
                                        cardStyle = 'border-2 border-blue-200 rounded-lg p-3 bg-blue-50/40 dark:bg-blue-950/20 dark:border-blue-900/50';
                                        sourcingBadge = (
                                            <div className="flex items-center gap-1.5 rounded-md bg-blue-100 dark:bg-blue-900/40 px-2 py-1">
                                                <Truck className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300">Internal Transfer</span>
                                                <span className="text-[10px] text-blue-500 dark:text-blue-400">· {stockInMain} available</span>
                                            </div>
                                        );
                                    } else if (isPartiallyCovered) {
                                        cardStyle = 'border-2 border-amber-200 rounded-lg p-3 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-900/50';
                                        sourcingBadge = (
                                            <div className="flex items-center gap-1.5 rounded-md bg-amber-100 dark:bg-amber-900/40 px-2 py-1">
                                                <Package className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                                                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">Split Sourcing</span>
                                                <span className="text-[10px] text-amber-500 dark:text-amber-400">· {stockInMain} transfer + {qty - stockInMain!} order</span>
                                            </div>
                                        );
                                    } else if (isExternal) {
                                        cardStyle = 'border-2 border-purple-200 rounded-lg p-3 bg-purple-50/40 dark:bg-purple-950/20 dark:border-purple-900/50';
                                        sourcingBadge = (
                                            <div className="flex items-center gap-1.5 rounded-md bg-purple-100 dark:bg-purple-900/40 px-2 py-1">
                                                <ShoppingCart className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                                <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300">Purchase Order</span>
                                                <span className="text-[10px] text-purple-500 dark:text-purple-400">· No stock available</span>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={idx} className={cardStyle}>
                                            {/* Sourcing badge + delete row */}
                                            <div className="mb-2.5 flex items-center justify-between min-h-[28px]">
                                                <div>{sourcingBadge}</div>
                                                {data.items.length > 1 && (
                                                    <Button type="button" variant="ghost" size="icon" className="text-destructive h-7 w-7 -mr-1 shrink-0" onClick={() => removeLine(idx)}>
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-12 gap-3 items-end">
                                                {/* Item selector */}
                                                <div className="col-span-12 md:col-span-5 flex flex-col gap-1">
                                                    <Label className="text-xs">Item</Label>
                                                    <Select
                                                        value={line.item_id}
                                                        onValueChange={v => updateLine(idx, 'item_id', v)}
                                                    >
                                                        <SelectTrigger className="h-9 text-sm">
                                                            <SelectValue placeholder="— Select Item —" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {items.map(item => (
                                                                <SelectItem key={item.id} value={String(item.id)}>
                                                                    [{item.sku}] {item.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Qty */}
                                                <div className="col-span-4 md:col-span-2 flex flex-col gap-1">
                                                    <Label className="text-xs">Qty</Label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        className="h-9"
                                                        value={line.quantity}
                                                        onChange={e => updateLine(idx, 'quantity', e.target.value)}
                                                    />
                                                </div>

                                                {/* Unit Price */}
                                                <div className="col-span-8 md:col-span-3 flex flex-col gap-1">
                                                    <Label className="text-xs">Unit Price</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        className="h-9"
                                                        value={line.price}
                                                        onChange={e => updateLine(idx, 'price', e.target.value)}
                                                    />
                                                </div>

                                                {/* Subtotal */}
                                                <div className="col-span-12 md:col-span-2 flex flex-col gap-1">
                                                    <Label className="text-xs">Subtotal</Label>
                                                    <div className="h-9 flex items-center text-sm font-mono font-bold px-1">
                                                        ₱{(parseFloat(line.quantity || '0') * parseFloat(line.price || '0')).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
