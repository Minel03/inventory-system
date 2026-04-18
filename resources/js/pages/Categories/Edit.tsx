import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Category, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
    {
        title: 'Edit Category',
        href: '#',
    },
];

interface Props {
    category: Category;
    categories: Category[];
}

export default function Edit({ category, categories }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        prefix: category.prefix,
        parent_id: category.parent_id?.toString() || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/categories/${category.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Category: ${category.name}`} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading title={`Edit Category: ${category.name}`} description="Update category details and SKU prefix." />
                </div>

                <div className="flex justify-center">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle>Category Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="parent_id">Parent Category (Optional)</Label>
                                    <Select value={data.parent_id} onValueChange={(value) => setData('parent_id', value === 'none' ? '' : value)}>
                                        <SelectTrigger id="parent_id">
                                            <SelectValue placeholder="No Parent (Top Level)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No Parent (Top Level)</SelectItem>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.parent_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="name">Category Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Electronics"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="prefix">SKU Prefix</Label>
                                    <Input
                                        id="prefix"
                                        value={data.prefix}
                                        onChange={(e) => setData('prefix', e.target.value)}
                                        placeholder="e.g. ELEC"
                                        className="font-mono text-xs uppercase"
                                        required
                                        maxLength={10}
                                    />
                                    <p className="text-muted-foreground mt-1 text-xs">
                                        Note: Changing the prefix will affect SKUs generated for future items in this category.
                                    </p>
                                    <InputError message={errors.prefix} />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4">
                                    <Button variant="outline" asChild>
                                        <Link href="/categories">Cancel</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Saving...' : 'Update Category'}
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
