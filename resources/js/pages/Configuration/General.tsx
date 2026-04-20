import ConfigurationLayout from '@/layouts/configuration/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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

export default function GeneralConfiguration({ settings }: Props) {
    const { data, setData, post, processing } = useForm({
        settings: {
            company_name: settings.company_name || '',
            company_address: settings.company_address || '',
            company_phone: settings.company_phone || '',
            po_prefix: settings.po_prefix || 'PO',
            po_start_number: settings.po_start_number || '1',
            pr_prefix: settings.pr_prefix || 'PR',
            pr_start_number: settings.pr_start_number || '1',
        },
        group: 'general' // We handle both general and numbering in this view but default to general group logic
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('configuration.update'), {
            onSuccess: () => toast.success('Settings updated successfully'),
            preserveScroll: true,
        });
    };

    const updateSetting = (key: string, value: string) => {
        setData('settings', {
            ...data.settings,
            [key]: value,
        });
    };

    return (
        <ConfigurationLayout>
            <Head title="General Configuration" />
            
            <form onSubmit={submit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Company Information</CardTitle>
                        <CardDescription>
                            General details about your company used in documents like POs and PRs.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="company_name">Company Name</Label>
                            <Input 
                                id="company_name" 
                                value={data.settings.company_name} 
                                onChange={e => updateSetting('company_name', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="company_address">Address</Label>
                            <Input 
                                id="company_address" 
                                value={data.settings.company_address} 
                                onChange={e => updateSetting('company_address', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="company_phone">Phone Number</Label>
                            <Input 
                                id="company_phone" 
                                value={data.settings.company_phone} 
                                onChange={e => updateSetting('company_phone', e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>PO & PR Numbering</CardTitle>
                        <CardDescription>
                            Configure how Purchase Orders and Requisitions are numbered.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4 border-r pr-6 last:border-0">
                                <h3 className="font-medium text-sm">Purchase Requisition (PR)</h3>
                                <div className="grid gap-2">
                                    <Label htmlFor="pr_prefix">Prefix</Label>
                                    <Input 
                                        id="pr_prefix" 
                                        value={data.settings.pr_prefix} 
                                        onChange={e => updateSetting('pr_prefix', e.target.value)}
                                        placeholder="PR"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="pr_start_number">Starting Number</Label>
                                    <Input 
                                        id="pr_start_number" 
                                        type="number"
                                        value={data.settings.pr_start_number} 
                                        onChange={e => updateSetting('pr_start_number', e.target.value)}
                                        placeholder="1"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-medium text-sm">Purchase Order (PO)</h3>
                                <div className="grid gap-2">
                                    <Label htmlFor="po_prefix">Prefix</Label>
                                    <Input 
                                        id="po_prefix" 
                                        value={data.settings.po_prefix} 
                                        onChange={e => updateSetting('po_prefix', e.target.value)}
                                        placeholder="PO"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="po_start_number">Starting Number</Label>
                                    <Input 
                                        id="po_start_number" 
                                        type="number"
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
