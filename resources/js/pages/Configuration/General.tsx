import ConfigurationLayout from '@/layouts/configuration/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
        },
        group: 'general',
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
                        <div className="pt-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Settings
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </ConfigurationLayout>
    );
}
