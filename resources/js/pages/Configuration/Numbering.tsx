import ConfigurationLayout from '@/layouts/configuration/layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Head, useForm } from '@inertiajs/react';
import { Save, LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

interface Props {
    settings: Record<string, string>;
}

export default function NumberingConfiguration({ settings }: Props) {
    const { data, setData, post, processing } = useForm({
        settings: {
            po_prefix: settings.po_prefix || 'PO',
            po_start_number: settings.po_start_number || '1',
            pr_prefix: settings.pr_prefix || 'PR',
            pr_start_number: settings.pr_start_number || '1',
        },
        group: 'numbering',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('configuration.update'), {
            onSuccess: () => toast.success('Numbering settings saved.'),
            preserveScroll: true,
        });
    };

    const updateSetting = (key: string, value: string) => {
        setData('settings', { ...data.settings, [key]: value });
    };

    return (
        <ConfigurationLayout>
            <Head title="PO & PR Numbering" />
            <form onSubmit={submit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>PO &amp; PR Numbering</CardTitle>
                        <CardDescription>
                            Configure how Purchase Orders and Purchase Requisitions are numbered. Changes affect <strong>new</strong> documents only.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* PR */}
                            <div className="space-y-4 border-r pr-6 last:border-0">
                                <h3 className="font-semibold text-sm">Purchase Requisition (PR)</h3>
                                <div className="grid gap-2">
                                    <Label htmlFor="pr_prefix">Prefix</Label>
                                    <Input
                                        id="pr_prefix"
                                        value={data.settings.pr_prefix}
                                        onChange={e => updateSetting('pr_prefix', e.target.value)}
                                        placeholder="PR"
                                    />
                                    <p className="text-xs text-muted-foreground">Example: <span className="font-mono font-bold">{data.settings.pr_prefix || 'PR'}-2026-0001</span></p>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="pr_start_number">Starting Number</Label>
                                    <Input
                                        id="pr_start_number"
                                        type="number"
                                        min="1"
                                        value={data.settings.pr_start_number}
                                        onChange={e => updateSetting('pr_start_number', e.target.value)}
                                        placeholder="1"
                                    />
                                </div>
                            </div>

                            {/* PO */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-sm">Purchase Order (PO)</h3>
                                <div className="grid gap-2">
                                    <Label htmlFor="po_prefix">Prefix</Label>
                                    <Input
                                        id="po_prefix"
                                        value={data.settings.po_prefix}
                                        onChange={e => updateSetting('po_prefix', e.target.value)}
                                        placeholder="PO"
                                    />
                                    <p className="text-xs text-muted-foreground">Example: <span className="font-mono font-bold">{data.settings.po_prefix || 'PO'}-2026-0001</span></p>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="po_start_number">Starting Number</Label>
                                    <Input
                                        id="po_start_number"
                                        type="number"
                                        min="1"
                                        value={data.settings.po_start_number}
                                        onChange={e => updateSetting('po_start_number', e.target.value)}
                                        placeholder="1"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t pt-6">
                        <Button type="submit" disabled={processing}>
                            {processing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Settings
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </ConfigurationLayout>
    );
}
