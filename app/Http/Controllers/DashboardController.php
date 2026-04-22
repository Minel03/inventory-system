<?php

namespace App\Http\Controllers;

use App\Models\InventoryMovement;
use App\Models\Item;
use App\Models\Purchase;
use App\Models\StockTransfer;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $items = Item::with(['category', 'unit', 'warehouses'])->get();
        $total_inventory_value = 0;
        $low_stock_items = [];

        $items->each(function ($item) use (&$total_inventory_value, &$low_stock_items) {
            $item->global_stock = $item->warehouses->sum('quantity');
            $total_inventory_value += $item->global_stock * $item->price;
            
            if ($item->global_stock < 10) {
                $low_stock_items[] = $item;
            }
        });

        // Top moving items
        $movements = InventoryMovement::where('created_at', '>=', now()->subDays(30))
            ->selectRaw('item_id, SUM(ABS(quantity)) as volume')
            ->groupBy('item_id')
            ->pluck('volume', 'item_id');

        $items->each(function ($item) use ($movements) {
            $item->volume_30d = $movements->get($item->id, 0);
        });

        $top_moving_items = $items->sortByDesc('volume_30d')->take(5)->values();
        $low_stock_items = collect($low_stock_items)->sortBy('global_stock')->take(5)->values();

        $recent_transfers = StockTransfer::with(['fromWarehouse', 'toWarehouse', 'item'])
            ->latest()
            ->take(5)
            ->get();

        $stats = [
            'total_items' => Item::count(),
            'total_warehouses' => Warehouse::count(),
            'pending_prs' => Purchase::where('status', 'po_draft')->count(),
            'active_transfers' => StockTransfer::whereNotIn('status', ['received', 'cancelled'])->count(),
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'analytics' => [
                'total_inventory_value' => $total_inventory_value,
                'low_stock_items' => $low_stock_items,
                'top_moving_items' => $top_moving_items,
                'recent_transfers' => $recent_transfers,
            ],
        ]);
    }
}
