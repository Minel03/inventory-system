<?php

namespace App\Http\Controllers;

use App\Models\InventoryMovement;
use App\Models\Item;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Setting;
use App\Models\Supplier;
use App\Models\Warehouse;
use App\Models\WarehouseItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    /** Generate a sequential PR number: PR-YYYY-XXXX */
    private function generatePrNumber(): string
    {
        $year = now()->year;
        $count = Purchase::whereYear('created_at', $year)->count() + 1;

        return sprintf('PR-%d-%04d', $year, $count);
    }

    /** Generate a sequential PO number: PO-YYYY-XXXX */
    private function generatePoNumber(): string
    {
        $year = now()->year;
        // Count only records that already have a PO number
        $count = Purchase::whereYear('created_at', $year)->whereNotNull('po_number')->count() + 1;

        return sprintf('PO-%d-%04d', $year, $count);
    }

    public function index()
    {
        $user = Auth::user();
        $query = Purchase::with(['supplier', 'warehouse', 'items.item'])->latest();

        // Data Scoping: If user is assigned to a specific warehouse, only show those records
        if ($user->role === 'warehouse' && $user->warehouse_id) {
            $query->where('warehouse_id', $user->warehouse_id);
        }

        $purchases = $query->get();

        // PRs: only "pending" (not yet approved into a PO)
        $requisitions = $purchases->filter(fn ($p) => $p->status === 'pending')->values();

        // POs: everything that has been approved (has a PO number)
        $orders = $purchases->filter(fn ($p) => $p->status !== 'pending')->values();

        return Inertia::render('Purchases/Index', [
            'requisitions' => $requisitions,
            'orders' => $orders,
        ]);
    }

    public function create()
    {
        return Inertia::render('Purchases/Create', [
            'items' => Item::with(['unit', 'category'])->get(),
            'warehouses' => Warehouse::orderByDesc('is_main')->get(),
        ]);
    }

    /**
     * Store a new Purchase Requisition.
     * Generates a PR number immediately. No supplier yet.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'warehouse_id' => 'required|exists:warehouses,id',
            'expected_delivery_date' => 'nullable|date|after_or_equal:today',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            $purchase = Purchase::create([
                'pr_number' => $this->generatePrNumber(),
                'warehouse_id' => $validated['warehouse_id'],
                'expected_delivery_date' => $validated['expected_delivery_date'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'status' => 'pending',
                'purchase_date' => now()->toDateString(),
            ]);

            foreach ($validated['items'] as $lineItem) {
                PurchaseItem::create([
                    'purchase_id' => $purchase->id,
                    'item_id' => $lineItem['item_id'],
                    'quantity' => $lineItem['quantity'],
                    'price' => $lineItem['price'],
                ]);
            }
        });

        return redirect()->route('purchases.index')->with('success', 'Purchase Requisition submitted.');
    }

    public function show(Purchase $purchase)
    {
        $purchase->load(['supplier', 'warehouse', 'items.item.unit', 'l1Approver', 'l2Approver']);

        return Inertia::render('Purchases/Show', [
            'purchase' => $purchase,
            'suppliers' => Supplier::orderBy('name')->get(),
            'companySettings' => [
                'name' => Setting::get('company_name', 'Inventory System'),
                'address' => Setting::get('company_address', '123 Business Road, Suite 100'),
                'phone' => Setting::get('company_phone', '(555) 012-3456'),
            ],
        ]);
    }

    public function print(Purchase $purchase)
    {
        $purchase->load(['supplier', 'warehouse', 'items.item.unit']);

        return Inertia::render('Purchases/Print', [
            'purchase' => $purchase,
            'companyName' => Setting::get('company_name', 'Inventory System'),
            'companyAddress' => Setting::get('company_address', '123 Business Road, Suite 100'),
            'companyPhone' => Setting::get('company_phone', '(555) 012-3456'),
        ]);
    }

    /**
     * Approve a Requisition.
     * Automatically generates a PO number and moves status to "po_draft".
     * The buyer still needs to assign a supplier.
     */
    public function approve(Purchase $purchase)
    {
        if ($purchase->status !== 'pending') {
            return back()->withErrors(['status' => 'Only pending requisitions can be approved.']);
        }

        $purchase->update([
            'status' => 'po_draft',
            'po_number' => $this->generatePoNumber(),
        ]);

        return back()->with('success', "PR {$purchase->pr_number} approved. Draft PO {$purchase->po_number} has been created.");
    }

    /**
     * Buyer assigns a supplier and activates the PO (status → ordered).
     */
    public function assignSupplier(Request $request, Purchase $purchase)
    {
        if ($purchase->status !== 'po_draft') {
            return back()->withErrors(['status' => 'Only draft POs can be assigned a supplier.']);
        }

        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
        ]);

        $purchase->update([
            'supplier_id' => $validated['supplier_id'],
            'status' => 'awaiting_l1',
        ]);

        return back()->with('success', 'Supplier assigned. PO is now awaiting Level 1 Approval.');
    }

    public function approveL1(Purchase $purchase)
    {
        if ($purchase->status !== 'awaiting_l1') {
            return back()->withErrors(['status' => 'Order is not at Level 1 Approval stage.']);
        }

        $purchase->update([
            'status' => 'awaiting_l2',
            'l1_approved_by' => Auth::id(),
            'l1_approved_at' => now(),
        ]);

        return back()->with('success', 'Level 1 Approval signed off.');
    }

    public function approveL2(Purchase $purchase)
    {
        if ($purchase->status !== 'awaiting_l2') {
            return back()->withErrors(['status' => 'Order is not at Level 2 Approval stage.']);
        }

        $purchase->update([
            'status' => 'ordered',
            'l2_approved_by' => Auth::id(),
            'l2_approved_at' => now(),
        ]);

        return back()->with('success', 'Level 2 Approval signed off. PO is now officially Ordered.');
    }

    /**
     * Record goods receipt — per-line delivery quantities.
     * Supports partial delivery: PO stays "partially_received" until all lines are fulfilled.
     */
    public function receive(Request $request, Purchase $purchase)
    {
        if (! in_array($purchase->status, ['ordered', 'partially_received'])) {
            return back()->withErrors(['status' => 'Only ordered or partially received POs can be received.']);
        }

        $validated = $request->validate([
            'received' => 'required|array',
            'received.*.line_id' => 'required|exists:purchase_items,id',
            'received.*.quantity' => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($validated, $purchase) {
            foreach ($validated['received'] as $entry) {
                $lineItem = PurchaseItem::find($entry['line_id']);

                if (! $lineItem || (int) $entry['quantity'] <= 0) {
                    continue;
                }

                $qtyDelivered = (int) $entry['quantity'];

                // Don't allow receiving more than what was ordered
                $remaining = $lineItem->quantity - $lineItem->quantity_received;
                $qtyDelivered = min($qtyDelivered, $remaining);

                if ($qtyDelivered <= 0) {
                    continue;
                }

                // Update received qty using a direct query update to avoid method resolution issues
                PurchaseItem::where('id', $lineItem->id)->update([
                    'quantity_received' => $lineItem->quantity_received + $qtyDelivered
                ]);

                // Add stock to warehouse
                $warehouseItem = WarehouseItem::firstOrCreate(
                    ['warehouse_id' => $purchase->warehouse_id, 'item_id' => $lineItem->item_id],
                    ['quantity' => 0]
                );
                
                // Update warehouse stock using a direct query update
                WarehouseItem::where('id', $warehouseItem->id)->update([
                    'quantity' => $warehouseItem->quantity + $qtyDelivered
                ]);

                // Log movement
                InventoryMovement::create([
                    'warehouse_id' => $purchase->warehouse_id,
                    'item_id' => $lineItem->item_id,
                    'user_id' => Auth::id(),
                    'quantity' => $qtyDelivered,
                    'type' => 'purchase',
                    'reference_id' => $purchase->id,
                    'notes' => "Received {$qtyDelivered} unit(s) via {$purchase->po_number}",
                ]);
            }

            // Refresh line items to check if fully received
            $purchase->load('items');
            $allFulfilled = $purchase->items->every(fn ($l) => $l->quantity_received >= $l->quantity);

            $purchase->update([
                'status' => $allFulfilled ? 'received' : 'partially_received',
            ]);
        });

        return back()->with('success', 'Delivery recorded successfully.');
    }

    /**
     * Cancel a PR or PO (not allowed once received).
     */
    public function cancel(Purchase $purchase)
    {
        if ($purchase->status === 'received') {
            return back()->withErrors(['status' => 'Received orders cannot be cancelled.']);
        }

        $purchase->update(['status' => 'cancelled']);

        return back()->with('success', 'Cancelled successfully.');
    }
}
