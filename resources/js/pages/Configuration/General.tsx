import ConfigurationLayout from '@/layouts/configuration/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';

export default function GeneralConfiguration() {
    return (
        <ConfigurationLayout>
            <Head title="General Configuration" />
            
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>
                        System-wide settings for your inventory system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground italic">
                        General system settings will appear here in a future update.
                    </p>
                </CardContent>
            </Card>
        </ConfigurationLayout>
    );
}
