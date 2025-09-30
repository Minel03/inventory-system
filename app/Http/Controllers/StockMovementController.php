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
    public function __construct() {}

    public function index(Request $request)
    {
        $query = StockMovement::with(['product', 'supplier', 'warehouse']);

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

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('product')) {
            $query->where('product_id', $request->product);
        }

        $stockMovements = $query->orderBy('date', 'desc')->paginate(10);
        return view('stock-movements.index', compact('stockMovements'));
    }

    public function create(Request $request)
    {
        $products = Product::all();
        $suppliers = Supplier::all();
        $warehouses = Warehouse::all();

        // Generate unique reference_no based on type
        $type = $request->query('type');
        $prefix = match ($type) {
            'In' => 'PO',
            'Out' => 'SO',
            'Adjustment' => 'ADJ',
            default => 'SM',
        };
        $count = StockMovement::where('reference_no', 'like', "$prefix%")->count() + 1;
        $reference_no = sprintf('%s-%03d', $prefix, $count);

        return view('stock-movements.create', compact('products', 'suppliers', 'warehouses', 'reference_no'));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'warehouse_id' => 'nullable|exists:warehouses,id',
            'type' => 'required|in:In,Out,Adjustment',
            'reference_no' => 'required|string|max:100|unique:stock_movements,reference_no',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'date' => 'required|date',
            'quantity' => 'required_if:type,In,Out|integer|min:1|nullable',
            'unit_cost' => 'required_if:type,In|numeric|min:0|nullable',
            'expiry_date' => 'nullable|date',
            'destination' => 'nullable|string|max:255',
            'reason' => 'nullable|string|max:255',
            'adjustment_diff' => 'required_if:type,Adjustment|integer|nullable',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();
        $data['total_cost'] = $data['type'] === 'In' && isset($data['quantity'], $data['unit_cost'])
            ? $data['quantity'] * $data['unit_cost']
            : null;

        StockMovement::create($data);
        return redirect()->route('stock-movements.index')->with('success', 'Stock movement recorded.');
    }

    public function show(string $id)
    {
        $stockMovement = StockMovement::with(['product', 'supplier', 'warehouse'])->findOrFail($id);
        return view('stock-movements.show', compact('stockMovement'));
    }

    public function edit(string $id)
    {
        $stockMovement = StockMovement::findOrFail($id);
        $products = Product::all();
        $suppliers = Supplier::all();
        $warehouses = Warehouse::all();
        return view('stock-movements.edit', compact('stockMovement', 'products', 'suppliers', 'warehouses'));
    }

    public function update(Request $request, string $id)
    {
        $stockMovement = StockMovement::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'warehouse_id' => 'nullable|exists:warehouses,id',
            'type' => 'required|in:In,Out,Adjustment',
            'reference_no' => 'required|string|max:100|unique:stock_movements,reference_no,' . $id,
            'supplier_id' => 'nullable|exists:suppliers,id',
            'date' => 'required|date',
            'quantity' => 'required_if:type,In,Out|integer|min:1|nullable',
            'unit_cost' => 'required_if:type,In|numeric|min:0|nullable',
            'expiry_date' => 'nullable|date',
            'destination' => 'nullable|string|max:255',
            'reason' => 'nullable|string|max:255',
            'adjustment_diff' => 'required_if:type,Adjustment|integer|nullable',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();
        $data['total_cost'] = $data['type'] === 'In' && isset($data['quantity'], $data['unit_cost'])
            ? $data['quantity'] * $data['unit_cost']
            : null;

        $stockMovement->update($data);
        return redirect()->route('stock-movements.index')->with('success', 'Stock movement updated.');
    }

    public function destroy(string $id)
    {
        $stockMovement = StockMovement::findOrFail($id);
        $stockMovement->delete();
        return redirect()->route('stock-movements.index')->with('success', 'Stock movement deleted.');
    }

    public function stockLevel($productId)
    {
        $stock = StockMovement::where('product_id', $productId)
            ->sum(DB::raw("CASE WHEN type='In' THEN quantity WHEN type='Out' THEN -quantity ELSE adjustment_diff END"));
        $product = Product::findOrFail($productId);
        $lowStockAlert = $stock < $product->reorder_level ? "Low stock: $stock (below reorder level: {$product->reorder_level})" : null;
        return view('stock-movements.stock-level', compact('stock', 'product', 'lowStockAlert'));
    }
}
