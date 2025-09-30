<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\StockMovement;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;

class PurchaseOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function __construct() {}
    public function index(Request $request)
    {
        $query = PurchaseOrder::with(['supplier', 'purchaseRequisition']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('po_number', 'like', "%{$search}%")
                    ->orWhereHas('supplier', function ($supplierQuery) use ($search) {
                        $supplierQuery->where('company_name', 'like', "%{$search}%")
                            ->orWhere('contact_person', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by supplier
        if ($request->filled('supplier')) {
            $query->where('supplier_id', $request->supplier);
        }

        $purchaseOrders = $query->orderBy('date', 'desc')->paginate(10);
        return view('purchase-orders.index', compact('purchaseOrders'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $suppliers = Supplier::all();
        $products = Product::all();
        return view('purchase-orders.create', compact('suppliers', 'products'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'po_number' => 'required|unique:purchase_orders,po_number',
            'supplier_id' => 'required|exists:suppliers,id',
            'date' => 'required|date',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'status' => 'required|in:Pending,Approved,Received',
            'purchase_requisition_id' => 'nullable|exists:purchase_requisitions,id',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();
        $data['items'] = json_encode($data['items']);
        $po = PurchaseOrder::create($data);

        // Create stock movements if status is Received
        if ($data['status'] === 'Received') {
            $this->createStockMovements($po);
        }

        return redirect()->route('purchase-orders.index')->with('success', 'Purchase order created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $purchaseOrder = PurchaseOrder::with(['supplier', 'purchaseRequisition'])->findOrFail($id);
        return view('purchase-orders.show', compact('purchaseOrder'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $purchaseOrder = PurchaseOrder::findOrFail($id);
        $suppliers = Supplier::all();
        $products = Product::all();
        return view('purchase-orders.edit', compact('purchaseOrder', 'suppliers', 'products'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $purchaseOrder = PurchaseOrder::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'po_number' => 'required|unique:purchase_orders,po_number,' . $id,
            'supplier_id' => 'required|exists:suppliers,id',
            'date' => 'required|date',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'status' => 'required|in:Pending,Approved,Received',
            'purchase_requisition_id' => 'nullable|exists:purchase_requisitions,id',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();
        $data['items'] = json_encode($data['items']);
        $purchaseOrder->update($data);

        // Create stock movements if status changed to Received
        if ($data['status'] === 'Received' && $purchaseOrder->getOriginal('status') !== 'Received') {
            $this->createStockMovements($purchaseOrder);
        }

        return redirect()->route('purchase-orders.index')->with('success', 'Purchase order updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $purchaseOrder = PurchaseOrder::findOrFail($id);
        $purchaseOrder->delete();
        return redirect()->route('purchase-orders.index')->with('success', 'Purchase order deleted.');
    }

    protected function createStockMovements(PurchaseOrder $po)
    {
        $items = $po->items;

        if (!is_array($items)) {
            return; // Exit if items is not a valid array
        }

        foreach ($items as $item) {
            $product = Product::find($item['product_id']);
            if ($product) {
                StockMovement::create([
                    'product_id' => $item['product_id'],
                    'warehouse_id' => null, // Set default warehouse or add to form
                    'type' => 'in',
                    'reference_no' => $po->po_number,
                    'supplier_id' => $po->supplier_id,
                    'date' => $po->date,
                    'quantity' => $item['quantity'],
                    'unit_cost' => $product->cost_price,
                ]);
            }
        }
    }
}
