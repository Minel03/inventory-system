import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Item, Warehouse, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Purchases', href: '/purchases' },
    { title: 'New Requisition', href: '/purchases/create' },
];

interface LineItem {
    item_id: string;
    quantity: string;
    price: string;
    [key: string]: string; // Required for Inertia's useForm serialization
}

interface Props {
    items: Item[];
    warehouses: Warehouse[];
}

export default function PurchasesCreate({ items, warehouses }: Props) {
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

        // Auto-fill unit_cost from item selection
        if (field === 'item_id') {
            const selected = items.find(i => i.id === parseInt(value));
            if (selected) updated[index].price = String(selected.unit_cost);
        }

        setData('items', updated);
    }

    const totalValue = data.items.reduce((sum, l) => {
        return sum + (parseFloat(l.quantity || '0') * parseFloat(l.price || '0'));
    }, 0);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/purchases');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Requisition" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/purchases"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <Heading title="New Purchase Requisition" description="Request items to be purchased for a warehouse" />
                </div>

                <form onSubmit={submit} className="grid gap-4 md:grid-cols-3">
                    {/* Left column — metadata */}
                    <div className="md:col-span-1 flex flex-col gap-4">
                        <Card>
                            <CardHeader><CardTitle>Request Details</CardTitle></CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="warehouse_id">Destination Warehouse *</Label>
                                    <select
                                        id="warehouse_id"
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                        value={data.warehouse_id}
                                        onChange={e => setData('warehouse_id', e.target.value)}
                                    >
                                        <option value="">— Select Warehouse —</option>
                                        {warehouses.map(w => (
                                            <option key={w.id} value={w.id}>
                                                {w.name}{w.is_main ? ' (Main)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.warehouse_id && <p className="text-xs text-destructive">{errors.warehouse_id}</p>}
                                </div>
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
                                    <p className="text-[10px] text-muted-foreground italic">Optional: When do you need this to arrive?</p>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="notes">Notes / Reason</Label>
                                    <textarea
                                        id="notes"
                                        rows={4}
                                        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                                        placeholder="Optional justification or notes..."
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Estimated Total</CardTitle></CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">
                                    ₱{totalValue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">{data.items.length} line item(s)</p>
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
                                {data.items.map((line, idx) => (
                                    <div key={idx} className="grid grid-cols-12 gap-3 items-end border rounded-md p-3 bg-muted/20">
                                        <div className="col-span-12 md:col-span-5 flex flex-col gap-1">
                                            <Label className="text-xs">Item</Label>
                                            <select
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                                value={line.item_id}
                                                onChange={e => updateLine(idx, 'item_id', e.target.value)}
                                            >
                                                <option value="">— Select Item —</option>
                                                {items.map(item => (
                                                    <option key={item.id} value={item.id}>
                                                        [{item.sku}] {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-span-4 md:col-span-2 flex flex-col gap-1">
                                            <Label className="text-xs">Qty</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={line.quantity}
                                                onChange={e => updateLine(idx, 'quantity', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-8 md:col-span-3 flex flex-col gap-1">
                                            <Label className="text-xs">Unit Price</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={line.price}
                                                onChange={e => updateLine(idx, 'price', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-10 md:col-span-2 flex flex-col gap-1">
                                            <Label className="text-xs">Subtotal</Label>
                                            <div className="h-9 flex items-center text-sm font-mono font-bold px-1 text-blue-600 dark:text-blue-400">
                                                ₱{(parseFloat(line.quantity || '0') * parseFloat(line.price || '0')).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                            </div>
                                        </div>
                                        <div className="col-span-2 md:col-span-12 flex justify-end items-center">
                                            {data.items.length > 1 && (
                                                <Button type="button" variant="ghost" size="icon" className="text-destructive h-9 w-9" onClick={() => removeLine(idx)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
