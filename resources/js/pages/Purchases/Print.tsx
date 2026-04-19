import { Purchase } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

interface Props {
    purchase: Purchase;
    companyName: string;
    companyAddress: string;
    companyPhone: string;
}

export default function PurchasePrint({ purchase, companyName, companyAddress, companyPhone }: Props) {
    useEffect(() => {
        // Delay slightly to ensure fonts and styles are loaded
        const timer = setTimeout(() => {
            window.print();
        }, 800);

        // Attempt to auto-close the tab or go back after printing or cancelling
        window.onafterprint = () => {
            // 1. Try to close the tab (works if window.open was used)
            window.close();

            // 2. If window.close() was blocked by browser security,
            // check if there's any history to go back to
            if (window.history.length > 1) {
                window.history.back();
            } else {
                // 3. Last resort: redirect to the purchase page
                window.location.href = `/purchases/${purchase.id}`;
            }
        };

        return () => clearTimeout(timer);
    }, []);

    const total = purchase.items?.reduce((sum, item) => sum + item.quantity * item.price, 0) ?? 0;
    const isPR = !purchase.po_number;
    const documentLabel = isPR ? purchase.pr_number : purchase.po_number;

    return (
        <div className="min-h-screen bg-white p-4 font-sans text-black md:p-8">
            <Head title={`Print ${documentLabel}`} />

            {/* Navigation Overlay (Hidden when printing) */}
            <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
                <button
                    onClick={() => window.close()}
                    className="rounded-md bg-black px-4 py-2 text-sm font-bold text-white shadow-lg transition-colors hover:bg-gray-800"
                >
                    Return to Requisition
                </button>
            </div>

            <div className="relative mx-auto max-w-4xl border bg-white p-12 shadow-sm">
                {/* Header / Branding */}
                <div className="mb-8 flex items-start justify-between border-b-2 border-black pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight uppercase">{companyName}</h1>
                        <p className="mt-1 max-w-xs text-sm text-gray-600">{companyAddress}</p>
                        <p className="text-sm text-gray-600">Phone: {companyPhone}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-gray-400 uppercase">{isPR ? 'Purchase Requisition' : 'Purchase Order / Receipt'}</h2>
                        <p className="mt-1 font-mono text-lg font-bold text-black">{documentLabel}</p>
                        <p className="mt-1 text-sm text-gray-600">Date: {new Date(purchase.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Entity Info */}
                <div className="mb-8 grid grid-cols-2 gap-8">
                    <div className="rounded-sm border p-4">
                        <h3 className="mb-2 text-xs font-bold text-gray-500 uppercase">Vendor / Supplier</h3>
                        {purchase.supplier ? (
                            <div>
                                <p className="text-lg font-bold">{purchase.supplier.name}</p>
                                <p className="text-sm text-gray-600">{purchase.supplier.email}</p>
                                <p className="text-sm text-gray-600">{purchase.supplier.phone}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">Not assigned yet</p>
                        )}
                    </div>
                    <div className="rounded-sm border p-4">
                        <h3 className="mb-2 text-xs font-bold text-gray-500 uppercase">Ship To / Destination</h3>
                        <p className="text-lg font-bold">{purchase.warehouse?.name}</p>
                        <p className="text-sm text-gray-600">{purchase.warehouse?.address}</p>
                        <p className="mt-1 text-sm text-gray-600 italic">
                            {purchase.expected_delivery_date
                                ? `Expected Delivery: ${new Date(purchase.expected_delivery_date).toLocaleDateString()}`
                                : 'Expected Delivery: ASAP'}
                        </p>
                    </div>
                </div>

                {/* Line Items Table */}
                <table className="mb-8 w-full border-collapse text-sm">
                    <thead>
                        <tr className="border-t-2 border-b-2 border-black bg-gray-100">
                            <th className="px-2 py-2 text-left text-xs font-bold uppercase">SKU</th>
                            <th className="px-2 py-2 text-left text-xs font-bold uppercase">Description</th>
                            <th className="w-16 px-2 py-2 text-right text-xs font-bold uppercase">Qty</th>
                            <th className="w-20 px-2 py-2 text-right text-xs font-bold uppercase">Received</th>
                            <th className="px-2 py-2 text-right text-xs font-bold uppercase">Price</th>
                            <th className="px-2 py-2 text-right text-xs font-bold uppercase">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchase.items?.map((line) => (
                            <tr key={line.id} className="border-b">
                                <td className="px-2 py-3 font-mono">{line.item?.sku}</td>
                                <td className="px-2 py-3">
                                    <div className="font-bold">{line.item?.name}</div>
                                    <div className="text-[10px] text-gray-500 uppercase">{line.item?.category?.name}</div>
                                </td>
                                <td className="px-2 py-3 text-right font-mono">
                                    {line.quantity} <span className="text-[10px] text-gray-400 uppercase">{line.item?.unit?.abbreviation}</span>
                                </td>
                                <td className="px-2 py-3 text-right font-mono font-bold text-green-700">{line.quantity_received}</td>
                                <td className="px-2 py-3 text-right font-mono whitespace-nowrap">
                                    ₱{line.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-2 py-3 text-right font-mono font-bold whitespace-nowrap">
                                    ₱{(line.quantity * line.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={4} className="py-6 text-right text-xs font-bold text-gray-500 uppercase">
                                Total Amount
                            </td>
                            <td colSpan={2} className="border-b-4 border-double border-black py-6 text-right font-mono text-2xl font-black">
                                ₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </td>
                        </tr>
                    </tfoot>
                </table>

                {purchase.notes && (
                    <div className="mb-12 border-l-4 border-gray-300 bg-gray-50 p-4">
                        <h4 className="mb-1 text-xs font-bold text-gray-500 uppercase">Additional Notes</h4>
                        <p className="text-sm whitespace-pre-wrap text-gray-700">{purchase.notes}</p>
                    </div>
                )}

                {/* Footer / Signatures */}
                <div className="mt-auto pt-12">
                    <div className="grid grid-cols-3 gap-12 text-center">
                        <div>
                            <div className="mb-1 h-8 border-b border-black"></div>
                            <p className="text-[10px] font-bold uppercase">Requested By</p>
                        </div>
                        <div>
                            <div className="mb-1 h-8 border-b border-black"></div>
                            <p className="text-[10px] font-bold uppercase">Approved By</p>
                        </div>
                        <div>
                            <div className="mb-1 h-8 border-b border-black"></div>
                            <p className="text-[10px] font-bold uppercase">Received By</p>
                        </div>
                    </div>
                </div>

                <div className="no-print mt-2 text-center text-[9px] tracking-widest text-gray-400 uppercase">
                    Computer Generated Document • Printed on {new Date().toLocaleString()}
                </div>
            </div>

            {/* Print Styles */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @media print {
                    html, body { 
                        height: auto !important; 
                        margin: 0 !important; 
                        padding: 0 !important;
                        overflow: visible !important;
                    }
                    body { background: white !important; }
                    .no-print { display: none !important; }
                    .border { border: none !important; }
                    .shadow-sm { box-shadow: none !important; }
                    .max-w-4xl { max-width: 100% !important; margin: 0 !important; }
                    
                    /* Ensure no page breaks inside headers or rows */
                    tr { page-break-inside: avoid !important; }
                    
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            `,
                }}
            />
        </div>
    );
}
