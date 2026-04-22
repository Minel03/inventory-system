<?php

namespace App\Http\Controllers;

use App\Models\InventoryMovement;
use App\Models\Item;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function prReport()
    {
        $prs = Purchase::with(['warehouse', 'items.item'])
            ->where('status', 'pending')
            ->latest()
            ->get();

        return Inertia::render('Reports/PRReport', [
            'requisitions' => $prs,
        ]);
    }

    public function poReport()
    {
        $pos = Purchase::with(['supplier', 'warehouse', 'items.item'])
            ->where('status', '!=', 'pending')
            ->latest()
            ->get();

        return Inertia::render('Reports/POReport', [
            'orders' => $pos,
        ]);
    }

    public function itemReport()
    {
        // Get all items with their categories and units
        $items = Item::with(['category', 'unit', 'warehouses'])->get();

        // Calculate global stock per item by summing up quantities across all warehouses
        $items->each(function ($item) {
            $item->global_stock = $item->warehouses->sum('quantity');
        });

        // Get movement volume over the last 30 days
        // We consider both transfer_out and purchase (receiving) as movements, or just absolute sum of movements.
        // Let's use absolute sum of quantity to represent "volume of activity"
        $movements = InventoryMovement::where('created_at', '>=', now()->subDays(30))
            ->selectRaw('item_id, SUM(ABS(quantity)) as volume')
            ->groupBy('item_id')
            ->pluck('volume', 'item_id');

        $items->each(function ($item) use ($movements) {
            $item->volume_30d = $movements->get($item->id, 0);
        });

        // Sort by volume descending so fast moving are on top
        $items = $items->sortByDesc('volume_30d')->values();

        return Inertia::render('Reports/ItemReport', [
            'items' => $items,
        ]);
    }
}
