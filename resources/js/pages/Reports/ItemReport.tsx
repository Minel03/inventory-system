import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Item, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Download, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reports', href: '#' },
    { title: 'Item Movement', href: '/reports/items' }
];

interface ItemWithStats extends Item {
    global_stock: number;
    volume_30d: number;
}

interface Props {
    items: ItemWithStats[];
}

export default function ItemReport({ items }: Props) {
    const getMovementBadge = (volume: number) => {
        if (volume > 50) return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Fast Moving</Badge>;
        if (volume > 10) return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Average</Badge>;
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Slow Moving</Badge>;
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text('Item Movement Report', 14, 22);
        
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 30);
        
        const tableColumn = ["SKU", "Item Name", "Category", "Global Stock", "30-Day Volume", "Status"];
        const tableRows = items.map(item => {
            let status = 'SLOW MOVING';
            if (item.volume_30d > 50) status = 'FAST MOVING';
            else if (item.volume_30d > 10) status = 'AVERAGE';

            return [
                item.sku,
                item.name,
                item.category?.name || 'N/A',
                `${item.global_stock} ${item.unit?.abbreviation || ''}`,
                item.volume_30d.toString(),
                status
            ];
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'striped',
            headStyles: { fillColor: [15, 23, 42] }, // Slate 900
        });

        doc.save('item_movement_report.pdf');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Item Movement Report" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between no-print">
                    <Heading 
                        title="Item Movement Report" 
                        description="Analyze item activity volume over the last 30 days to identify fast and slow moving inventory." 
                    />
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
                    <div className="hidden print:block mb-6">
                        <h2 className="text-2xl font-bold text-black">Item Movement Report</h2>
                        <p className="text-sm text-gray-600">Analyze item activity volume over the last 30 days.</p>
                        <p className="text-xs text-gray-500 mt-1">Printed on {new Date().toLocaleString()}</p>
                    </div>

                    <Card className="print:border-0 print:shadow-none">
                        <CardContent className="p-0 overflow-x-auto print:overflow-visible">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 print:bg-transparent">
                                    <tr className="border-b print:border-black">
                                        <th className="h-10 px-4 text-left font-medium print:text-black">SKU</th>
                                        <th className="h-10 px-4 text-left font-medium print:text-black">Item Name</th>
                                        <th className="h-10 px-4 text-left font-medium print:text-black">Category</th>
                                        <th className="h-10 px-4 text-right font-medium print:text-black">Global Stock</th>
                                        <th className="h-10 px-4 text-right font-medium print:text-black">30-Day Volume</th>
                                        <th className="h-10 px-4 text-center font-medium print:text-black">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                                No items found.
                                            </td>
                                        </tr>
                                    )}
                                    {items.map((item) => (
                                        <tr key={item.id} className="border-b hover:bg-muted/50 print:border-gray-300">
                                            <td className="p-4 font-mono text-xs print:py-2">{item.sku}</td>
                                            <td className="p-4 font-medium print:py-2">{item.name}</td>
                                            <td className="p-4 print:py-2">{item.category?.name || 'N/A'}</td>
                                            <td className="p-4 text-right font-bold print:py-2">{item.global_stock} {item.unit?.abbreviation}</td>
                                            <td className="p-4 text-right font-medium print:py-2">{item.volume_30d}</td>
                                            <td className="p-4 text-center print:py-2">
                                                <span className="print:hidden">{getMovementBadge(item.volume_30d)}</span>
                                                <span className="hidden print:inline-block font-bold">
                                                    {item.volume_30d > 50 ? 'FAST MOVING' : item.volume_30d > 10 ? 'AVERAGE' : 'SLOW MOVING'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    html, body { height: auto !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; background: white !important; }
                    .no-print, aside, header, nav, [data-sidebar="sidebar"], [data-sidebar="header"] { display: none !important; }
                    main { padding: 0 !important; margin: 0 !important; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            `}} />
        </AppLayout>
    );
}
