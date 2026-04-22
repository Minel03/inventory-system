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
    { title: 'Purchase Orders', href: '/reports/po' },
];

interface Props {
    orders: Purchase[];
}

const STATUS_STYLES: Record<string, string> = {
    po_draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    awaiting_l1: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    awaiting_l2: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    ordered: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    partially_received: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    received: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function POReport({ orders }: Props) {
    const downloadPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('Purchase Orders Report', 14, 22);

        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 30);

        const tableColumn = ['Date', 'PO Number', 'Supplier', 'Warehouse', 'Total Cost', 'Status'];
        const tableRows = orders.map((po) => {
            const totalCost = po.items?.reduce((sum, item) => sum + item.quantity_ordered * Number(item.price), 0) || 0;
            return [
                new Date(po.created_at).toLocaleDateString(),
                po.po_number || 'N/A',
                po.supplier?.name || 'Not Assigned',
                po.warehouse?.name || 'N/A',
                `₱${totalCost.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
                po.status.replace('_', ' ').toUpperCase(),
            ];
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'striped',
            headStyles: { fillColor: [15, 23, 42] }, // Slate 900
        });

        doc.save('purchase_orders_report.pdf');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="PO Report" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="no-print flex items-center justify-between">
                    <Heading title="Purchase Orders Report" description="Overview of all purchase orders." />
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
                        <h2 className="text-2xl font-bold text-black">Purchase Orders Report</h2>
                        <p className="text-sm text-gray-600">Overview of all purchase orders.</p>
                        <p className="mt-1 text-xs text-gray-500">Printed on {new Date().toLocaleString()}</p>
                    </div>

                    <Card className="print:border-0 print:shadow-none">
                        <CardContent className="overflow-x-auto p-0 print:overflow-visible">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 print:bg-transparent">
                                    <tr className="border-b print:border-black">
                                        <th className="h-10 px-4 text-left font-medium print:text-black">Date</th>
                                        <th className="h-10 px-4 text-left font-medium print:text-black">PO Number</th>
                                        <th className="h-10 px-4 text-left font-medium print:text-black">Supplier</th>
                                        <th className="h-10 px-4 text-left font-medium print:text-black">Warehouse</th>
                                        <th className="h-10 px-4 text-right font-medium print:text-black">Total Cost</th>
                                        <th className="h-10 px-4 text-center font-medium print:text-black">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-muted-foreground p-8 text-center">
                                                No purchase orders found.
                                            </td>
                                        </tr>
                                    )}
                                    {orders.map((po) => {
                                        const totalCost = po.items?.reduce((sum, item) => sum + item.quantity_ordered * Number(item.price), 0) || 0;
                                        return (
                                            <tr key={po.id} className="hover:bg-muted/50 border-b print:border-gray-300">
                                                <td className="p-4 print:py-2">{new Date(po.created_at).toLocaleDateString()}</td>
                                                <td className="p-4 font-mono font-medium print:py-2">{po.po_number || 'N/A'}</td>
                                                <td className="p-4 print:py-2">{po.supplier?.name || 'Not Assigned'}</td>
                                                <td className="p-4 print:py-2">{po.warehouse?.name}</td>
                                                <td className="p-4 text-right print:py-2">${totalCost.toFixed(2)}</td>
                                                <td className="p-4 text-center print:py-2">
                                                    <Badge
                                                        variant="outline"
                                                        className={`${STATUS_STYLES[po.status] || ''} print:border-none print:bg-transparent print:text-black`}
                                                    >
                                                        {po.status.replace('_', ' ').toUpperCase()}
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
