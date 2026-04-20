<?php

namespace App\Http\Controllers;

use App\Models\StockTransfer;
use App\Models\PurchaseItem;
use App\Models\WarehouseItem;
use Illuminate\Http\Request;
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
     * Mark the transfer as received and update stock levels.
     */
    public function receive(StockTransfer $transfer)
    {
        if ($transfer->status !== 'processing') {
            return back()->withErrors(['status' => 'Transfer is not in processing state.']);
        }

        DB::transaction(function () use ($transfer) {
            // 1. Deduct from Source
            $source = WarehouseItem::where('warehouse_id', $transfer->from_warehouse)
                ->where('item_id', $transfer->item_id)
                ->first();

            if (!$source || $source->quantity < $transfer->quantity) {
                throw new \Exception("Insufficient stock in source warehouse.");
            }

            $source->decrement('quantity', $transfer->quantity);

            // 2. Add to Destination
            WarehouseItem::updateOrCreate(
                ['warehouse_id' => $transfer->to_warehouse, 'item_id' => $transfer->item_id],
                ['quantity' => DB::raw("quantity + {$transfer->quantity}")]
            );

            // 3. Update status
            $transfer->update(['status' => 'delivered']);
        });

        return back()->with('success', 'Stock transfer completed and quantities updated.');
    }
}
