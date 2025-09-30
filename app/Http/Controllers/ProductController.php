<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'supplier']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->filled('supplier')) {
            $query->where('supplier_id', $request->supplier);
        }

        $products = $query->paginate(10);
        return view('products.index', compact('products'));
    }

    public function create()
    {
        $categories = Category::all();
        $suppliers = Supplier::all();
        $count = Product::count() + 1;
        $prefix = 'PRD';
        if ($category_id = request()->query('category_id')) {
            $category = Category::find($category_id);
            $prefix = $category ? strtoupper(substr($category->name, 0, 3)) : 'PRD';
        }
        do {
            $sku = sprintf('%s-%04d', $prefix, $count);
            $count++;
        } while (Product::where('sku', $sku)->exists());
        return view('products.create', compact('categories', 'suppliers', 'sku'));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sku' => 'required|string|max:50|unique:products,sku',
            'name' => 'required|string|max:255',
            'brand' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'unit_measure' => 'required|in:pcs,box,kg,L,m,dozen',
            'cost_price' => 'required|numeric|min:0',
            'sell_price' => 'required|numeric|min:0',
            'vat_included' => 'boolean',
            'reorder_level' => 'required|integer|min:0',
            'expiry_date' => 'nullable|date',
            'batch_number' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput()->with('error', 'Failed to create product. Please check the form.');
        }

        $data = $validator->validated();
        $data['tags'] = $data['tags'] ?? [];
        $data['tags'] = json_encode($data['tags']);

        // Generate barcode
        $barcode = new \Milon\Barcode\DNS1D();
        $data['barcode'] = $barcode->getBarcodeSVG($data['sku'], 'C128');

        Product::create($data);

        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }

    public function show(Product $product)
    {
        $product->load(['category', 'supplier', 'stockMovements' => function ($query) {
            $query->with(['supplier', 'warehouse'])->orderBy('date', 'desc')->take(10);
        }]);
        return view('products.show', compact('product'));
    }

    public function edit(Product $product)
    {
        $categories = Category::all();
        $suppliers = Supplier::all();
        return view('products.edit', compact('product', 'categories', 'suppliers'));
    }

    public function update(Request $request, Product $product)
    {
        $validator = Validator::make($request->all(), [
            'sku' => 'required|string|max:50|unique:products,sku,' . $product->id,
            'name' => 'required|string|max:255',
            'brand' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'unit_measure' => 'required|in:pcs,box,kg,L,m,dozen',
            'cost_price' => 'required|numeric|min:0',
            'sell_price' => 'required|numeric|min:0',
            'vat_included' => 'boolean',
            'reorder_level' => 'required|integer|min:0',
            'expiry_date' => 'nullable|date',
            'batch_number' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput()->with('error', 'Failed to update product. Please check the form.');
        }

        $data = $validator->validated();
        $data['tags'] = $data['tags'] ?? [];
        $data['tags'] = json_encode($data['tags']);

        $product->update($data);

        return redirect()->route('products.show', $product)->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
    }
}
