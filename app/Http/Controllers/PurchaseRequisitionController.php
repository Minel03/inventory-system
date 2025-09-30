<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\PurchaseRequisition;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;

class PurchaseRequisitionController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function __construct() {}
    public function index()
    {
        $purchaseRequisitions = PurchaseRequisition::paginate(10);
        return view('purchase-requisitions.index', compact('purchaseRequisitions'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Product::all();
        return view('purchase-requisitions.create', compact('products'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pr_number' => 'required|unique:purchase_requisitions,pr_number',
            'date' => 'required|date',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'status' => 'required|in:Pending,Approved',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();
        $data['items'] = json_encode($data['items']); // Store as JSON
        $pr = PurchaseRequisition::create($data);

        // Auto-create PO if approved
        if ($data['status'] === 'Approved') {
            $this->createPurchaseOrder($pr);
        }

        return redirect()->route('purchase-requisitions.index')->with('success', 'Purchase requisition created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $purchaseRequisition = PurchaseRequisition::findOrFail($id);
        return view('purchase-requisitions.show', compact('purchaseRequisition'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $purchaseRequisition = PurchaseRequisition::findOrFail($id);
        $products = Product::all();
        return view('purchase-requisitions.edit', compact('purchaseRequisition', 'products'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $purchaseRequisition = PurchaseRequisition::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'pr_number' => 'required|unique:purchase_requisitions,pr_number,' . $id,
            'date' => 'required|date',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'status' => 'required|in:Pending,Approved',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();
        $data['items'] = json_encode($data['items']);
        $purchaseRequisition->update($data);

        // Auto-create PO if status changed to Approved
        if ($data['status'] === 'Approved' && $purchaseRequisition->getOriginal('status') !== 'Approved') {
            $this->createPurchaseOrder($purchaseRequisition);
        }

        return redirect()->route('purchase-requisitions.index')->with('success', 'Purchase requisition updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $purchaseRequisition = PurchaseRequisition::findOrFail($id);
        $purchaseRequisition->delete();
        return redirect()->route('purchase-requisitions.index')->with('success', 'Purchase requisition deleted.');
    }

    protected function createPurchaseOrder(PurchaseRequisition $pr)
    {
        $items = json_decode($pr->items, true);
        $supplierId = null;
        foreach ($items as $item) {
            $product = Product::find($item['product_id']);
            if ($product && $product->supplier_id) {
                $supplierId = $product->supplier_id;
                break;
            }
        }

        if ($supplierId) {
            PurchaseOrder::create([
                'po_number' => 'PO-' . $pr->pr_number,
                'supplier_id' => $supplierId,
                'date' => $pr->date,
                'items' => $pr->items,
                'status' => 'Pending',
                'purchase_requisition_id' => $pr->id,
            ]);
        }
    }
}
