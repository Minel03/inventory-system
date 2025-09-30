<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\Supplier;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class StockMovementController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function __construct() {}

    public function index(Request $request)
    {
        $query = StockMovement::with(['product', 'supplier', 'warehouse']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reference_no', 'like', "%{$search}%")
                    ->orWhere('destination', 'like', "%{$search}%")
                    ->orWhere('reason', 'like', "%{$search}%")
                    ->orWhereHas('product', function ($productQuery) use ($search) {
                        $productQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('sku', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by product
        if ($request->filled('product')) {
            $query->where('product_id', $request->product);
        }

        $stockMovements = $query->orderBy('date', 'desc')->paginate(10);
        return view('stock-movements.index', compact('stockMovements'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Product::all();
        $suppliers = Supplier::all();
        $warehouses = Warehouse::all();
        return view('stock-movements.create', compact('products', 'suppliers', 'warehouses'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'warehouse_id' => 'nullable|exists:warehouses,id',
            'type' => 'required|in:In,Out,Adjustment',
            'reference_no' => 'required|string|max:100',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'date' => 'required|date',
            'quantity' => 'required|integer|min:1',
            'unit_cost' => 'nullable|numeric|min:0',
            'expiry_date' => 'nullable|date',
            'destination' => 'nullable|string|max:255',
            'reason' => 'nullable|string|max:255',
            'adjustment_diff' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        StockMovement::create($validator->validated());
        return redirect()->route('stock-movements.index')->with('success', 'Stock movement recorded.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $stockMovement = StockMovement::with(['product', 'supplier', 'warehouse'])->findOrFail($id);
        return view('stock-movements.show', compact('stockMovement'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $stockMovement = StockMovement::findOrFail($id);
        $products = Product::all();
        $suppliers = Supplier::all();
        $warehouses = Warehouse::all();
        return view('stock-movements.edit', compact('stockMovement', 'products', 'suppliers', 'warehouses'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $stockMovement = StockMovement::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'warehouse_id' => 'nullable|exists:warehouses,id',
            'type' => 'required|in:in,out,adjustment',
            'reference_no' => 'required|string|max:100',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'date' => 'required|date',
            'quantity' => 'required|integer|min:1',
            'unit_cost' => 'nullable|numeric|min:0',
            'expiry_date' => 'nullable|date',
            'destination' => 'nullable|string|max:255',
            'reason' => 'nullable|string|max:255',
            'adjustment_diff' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $stockMovement->update($validator->validated());
        return redirect()->route('stock-movements.index')->with('success', 'Stock movement updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $stockMovement = StockMovement::findOrFail($id);
        $stockMovement->delete();
        return redirect()->route('stock-movements.index')->with('success', 'Stock movement deleted.');
    }

    public function stockLevel($productId)
    {
        $stock = StockMovement::where('product_id', $productId)
            ->sum(DB::raw("CASE WHEN type='in' THEN quantity WHEN type='out' THEN -quantity ELSE adjustment_diff END"));
        $product = Product::findOrFail($productId);
        $lowStockAlert = $stock < $product->reorder_level ? "Low stock: $stock (below reorder level: {$product->reorder_level})" : null;
        return view('stock-movements.stock-level', compact('stock', 'product', 'lowStockAlert'));
    }
}
