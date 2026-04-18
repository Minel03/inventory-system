import ConfigurationLayout from '@/layouts/configuration/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    settings: {
        category_prefix_length: string;
        sku_padding: string;
    };
}

export default function CategoriesConfiguration({ settings }: Props) {
    const { data, setData, post, processing } = useForm({
        group: 'categories',
        settings: {
            category_prefix_length: settings.category_prefix_length || '4',
            sku_padding: settings.sku_padding || '4',
        },
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/configuration/update');
    };

    return (
        <ConfigurationLayout>
            <Head title="Category Configuration" />
            
            <form onSubmit={submit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Category Settings</CardTitle>
                        <CardDescription>
                            Configure how categories behave, including automated prefix generation rules.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="category_prefix_length">Auto-generated Prefix Length</Label>
                            <Input
                                id="category_prefix_length"
                                type="number"
                                min="1"
                                max="10"
                                value={data.settings.category_prefix_length}
                                onChange={(e) => setData('settings', { ...data.settings, category_prefix_length: e.target.value })}
                            />
                            <p className="text-sm text-muted-foreground">
                                The number of characters to take from the category name when generating a prefix (e.g., "Electronics" with length 4 becomes "ELEC").
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="sku_padding">SKU Number Padding</Label>
                            <Input
                                id="sku_padding"
                                type="number"
                                min="1"
                                max="10"
                                value={data.settings.sku_padding}
                                onChange={(e) => setData('settings', { ...data.settings, sku_padding: e.target.value })}
                            />
                            <p className="text-sm text-muted-foreground">
                                The number of digits for the sequential part of the SKU (e.g., "4" for "0001", "3" for "001").
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save Settings'}
                    </Button>
                </div>
            </form>
        </ConfigurationLayout>
    );
}
