import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Category, Unit, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Items',
        href: '/items',
    },
    {
        title: 'Add Item',
        href: '/items/create',
    },
];

interface Props {
    categories: Category[];
    units: Unit[];
    sku_padding: number;
}

export default function Create({ categories, units, sku_padding }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        sku: '',
        unit_cost: '',
        category_id: '',
        unit_id: '',
        is_vatable: false as boolean,
    });

    // Auto-generate SKU when category changes
    useEffect(() => {
        if (data.category_id) {
            const category = categories.find((c) => c.id.toString() === data.category_id);
            if (category) {
                const nextNum = category.next_num || 1;
                const paddedNum = nextNum.toString().padStart(sku_padding, '0');
                setData('sku', `${category.prefix}-${paddedNum}`);
            }
        }
    }, [data.category_id, categories, sku_padding, setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/items');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Item" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Add Item" description="Create a new inventory item. SKU will be generated based on the selected category." />
                </div>

                <div className="flex justify-center">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle>Item Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="category_id">Category</Label>
                                    <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                        <SelectTrigger id="category_id shadow-none">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.path_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.category_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="unit_id">Unit of Measure</Label>
                                    <Select value={data.unit_id} onValueChange={(value) => setData('unit_id', value)}>
                                        <SelectTrigger id="unit_id shadow-none">
                                            <SelectValue placeholder="Select a unit (e.g. Box, Piece)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {units.map((unit) => (
                                                <SelectItem key={unit.id} value={unit.id.toString()}>
                                                    {unit.name} ({unit.abbreviation})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.unit_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="name">Item Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Wireless Mouse"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="sku">SKU (Auto-generated)</Label>
                                    <Input
                                        id="sku"
                                        value={data.sku}
                                        onChange={(e) => setData('sku', e.target.value)}
                                        placeholder="Select category first"
                                        className="font-mono text-xs uppercase"
                                        required
                                    />
                                    <InputError message={errors.sku} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="unit_cost">Unit Cost</Label>
                                    <Input
                                        id="unit_cost"
                                        type="number"
                                        step="0.01"
                                        value={data.unit_cost}
                                        onChange={(e) => setData('unit_cost', e.target.value)}
                                        placeholder="0.00"
                                        required
                                    />
                                    <InputError message={errors.unit_cost} />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_vatable"
                                        checked={data.is_vatable}
                                        onCheckedChange={(checked) => setData('is_vatable', checked === true)}
                                    />
                                    <Label htmlFor="is_vatable" className="font-normal text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Is Vatable (Subject to VAT)
                                    </Label>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4">
                                    <Button variant="outline" asChild>
                                        <Link href="/items">Cancel</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Saving...' : 'Save Item'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
