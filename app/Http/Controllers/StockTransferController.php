<?php

namespace App\Http\Controllers;

use App\Models\StockTransfer;
use App\Models\PurchaseItem;
use App\Models\WarehouseItem;
use App\Models\InventoryMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StockTransferController extends Controller
{
    public function index()
    {
        return inertia('Inventory/Transfers/Index', [
            'transfers' => StockTransfer::with(['item', 'fromWarehouse', 'toWarehouse'])->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'from_warehouse' => 'required|exists:warehouses,id',
            'to_warehouse' => 'required|exists:warehouses,id',
            'quantity' => 'required|integer|min:1',
            'purchase_item_id' => 'nullable|exists:purchase_items,id',
        ]);

        DB::transaction(function () use ($validated) {
            $transfer = StockTransfer::create([
                ...$validated,
                'status' => 'processing',
            ]);

            if (isset($validated['purchase_item_id'])) {
                PurchaseItem::where('id', $validated['purchase_item_id'])
                    ->increment('quantity_transferred', $validated['quantity']);
            }
        });

        return back()->with('success', 'Stock transfer initiated.');
    }

    /**
     * Mark the transfer as processed.
     */
    public function markProcessed(StockTransfer $transfer)
    {
        if ($transfer->status !== 'processing') {
            return back()->withErrors(['status' => 'Transfer is not in processing state.']);
        }

        $transfer->update(['status' => 'processed']);

        return back()->with('success', 'Transfer marked as processed.');
    }

    /**
     * Mark the transfer as in transit and deduct from source warehouse.
     */
    public function markInTransit(StockTransfer $transfer)
    {
        if ($transfer->status !== 'processed') {
            return back()->withErrors(['status' => 'Transfer must be processed before it can be in transit.']);
        }

        DB::transaction(function () use ($transfer) {
            // Deduct from Source
            $source = WarehouseItem::where('warehouse_id', $transfer->from_warehouse)
                ->where('item_id', $transfer->item_id)
                ->first();

            if (!$source || $source->quantity < $transfer->quantity) {
                throw new \Exception("Insufficient stock in source warehouse.");
            }

            $source->decrement('quantity', $transfer->quantity);

            // Log movement (Out)
            InventoryMovement::create([
                'warehouse_id' => $transfer->from_warehouse,
                'item_id' => $transfer->item_id,
                'user_id' => Auth::id(),
                'quantity' => -$transfer->quantity,
                'type' => 'transfer_out',
                'reference_id' => $transfer->id,
                'notes' => "Transferred out {$transfer->quantity} unit(s) to Warehouse #{$transfer->to_warehouse}",
            ]);

            // Update status
            $transfer->update(['status' => 'in_transit']);
        });

        return back()->with('success', 'Transfer is now in transit. Stock deducted from source.');
    }

    /**
     * Mark the transfer as received and update destination stock levels.
     */
    public function receive(StockTransfer $transfer)
    {
        if ($transfer->status !== 'in_transit') {
            return back()->withErrors(['status' => 'Transfer is not in transit state.']);
        }

        DB::transaction(function () use ($transfer) {
            // Add to Destination
            WarehouseItem::updateOrCreate(
                ['warehouse_id' => $transfer->to_warehouse, 'item_id' => $transfer->item_id],
                ['quantity' => DB::raw("quantity + {$transfer->quantity}")]
            );

            // Log movement (In)
            InventoryMovement::create([
                'warehouse_id' => $transfer->to_warehouse,
                'item_id' => $transfer->item_id,
                'user_id' => Auth::id(),
                'quantity' => $transfer->quantity,
                'type' => 'transfer_in',
                'reference_id' => $transfer->id,
                'notes' => "Received {$transfer->quantity} unit(s) from Warehouse #{$transfer->from_warehouse}",
            ]);

            // Update status
            $transfer->update(['status' => 'received']);
        });

        return back()->with('success', 'Stock transfer received and destination quantities updated.');
    }
}
