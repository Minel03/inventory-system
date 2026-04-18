import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ConfigurationLayout from '@/layouts/configuration/layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    settings: {
        sku_padding: string;
        sku_random_length?: string;
    };
}

export default function ItemsConfiguration({ settings }: Props) {
    const { data, setData, post, processing } = useForm({
        group: 'items',
        settings: {
            sku_padding: settings.sku_padding || '4',
        },
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/configuration/update');
    };

    return (
        <ConfigurationLayout>
            <Head title="Items Configuration" />

            <form onSubmit={submit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Item SKU Settings</CardTitle>
                        <CardDescription>Configure how item SKUs are generated across the system.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                            <p className="text-muted-foreground text-sm">
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
