import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Purchase, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, Printer } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reports', href: '#' },
    { title: 'Purchase Requisitions', href: '/reports/pr' },
];

interface Props {
    requisitions: Purchase[];
}

export default function PRReport({ requisitions }: Props) {
    const downloadPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('Purchase Requisitions Report', 14, 22);

        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 30);

        const tableColumn = ['Date', 'PR Number', 'Warehouse', 'Expected Delivery', 'Total Items', 'Status'];
        const tableRows = requisitions.map((pr) => [
            new Date(pr.created_at).toLocaleDateString(),
            pr.pr_number || 'N/A',
            pr.warehouse?.name || 'N/A',
            pr.expected_delivery_date ? new Date(pr.expected_delivery_date).toLocaleDateString() : 'N/A',
            (pr.items?.reduce((sum, item) => sum + item.quantity, 0) || 0).toString(),
            'PENDING',
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'striped',
            headStyles: { fillColor: [15, 23, 42] }, // Slate 900
        });

        doc.save('purchase_requisitions_report.pdf');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="PR Report" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="no-print flex items-center justify-between">
                    <Heading title="Purchase Requisitions Report" description="Overview of all pending purchase requisitions." />
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={downloadPDF}>
                            <Download className="mr-2 h-4 w-4" /> Download PDF
                        </Button>
                        <Button variant="outline" onClick={() => window.print()}>
                            <Printer className="mr-2 h-4 w-4" /> Print
                        </Button>
                    </div>
                </div>

                <div id="printable-report" className="bg-background">
                    <div className="mb-6 hidden print:block">
                        <h2 className="text-2xl font-bold text-black">Purchase Requisitions Report</h2>
                        <p className="text-sm text-gray-600">Overview of all pending purchase requisitions.</p>
                        <p className="mt-1 text-xs text-gray-500">Printed on {new Date().toLocaleString()}</p>
                    </div>

                    <Card className="print:border-0 print:shadow-none">
                        <CardContent className="overflow-x-auto p-0 print:overflow-visible">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 print:bg-transparent">
                                    <tr className="border-b print:border-black">
                                        <th className="h-10 px-4 text-left font-medium print:text-black">Date</th>
                                        <th className="h-10 px-4 text-left font-medium print:text-black">PR Number</th>
                                        <th className="h-10 px-4 text-left font-medium print:text-black">Warehouse</th>
                                        <th className="h-10 px-4 text-left font-medium print:text-black">Expected Delivery</th>
                                        <th className="h-10 px-4 text-right font-medium print:text-black">Total Items</th>
                                        <th className="h-10 px-4 text-center font-medium print:text-black">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requisitions.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-muted-foreground p-8 text-center">
                                                No pending requisitions found.
                                            </td>
                                        </tr>
                                    )}
                                    {requisitions.map((pr) => {
                                        const totalItems = pr.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                                        return (
                                            <tr key={pr.id} className="hover:bg-muted/50 border-b print:border-gray-300">
                                                <td className="p-4 print:py-2">{new Date(pr.created_at).toLocaleDateString()}</td>
                                                <td className="p-4 font-mono font-medium print:py-2">{pr.pr_number}</td>
                                                <td className="p-4 print:py-2">{pr.warehouse?.name}</td>
                                                <td className="p-4 print:py-2">
                                                    {pr.expected_delivery_date ? new Date(pr.expected_delivery_date).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="p-4 text-right print:py-2">{totalItems}</td>
                                                <td className="p-4 text-center print:py-2">
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 print:border-none print:bg-transparent print:text-black"
                                                    >
                                                        PENDING
                                                    </Badge>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @media print {
                    html, body { height: auto !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; background: white !important; }
                    .no-print, aside, header, nav, [data-sidebar="sidebar"], [data-sidebar="header"] { display: none !important; }
                    main { padding: 0 !important; margin: 0 !important; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            `,
                }}
            />
        </AppLayout>
    );
}
