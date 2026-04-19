<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Item;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function index()
    {
        return Inertia::render('Items/Index', [
            'items' => Item::with(['category', 'unit'])->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Items/Create', [
            'categories' => Category::all()->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'prefix' => $category->prefix,
                    'path_name' => $category->path_name,
                ];
            }),
            'units' => Unit::all(),
            'sku_padding' => (int) \App\Models\Setting::get('sku_padding', 4),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:items,sku',
            'unit_cost' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'unit_id' => 'required|exists:units,id',
            'is_vatable' => 'boolean',
        ]);

        $category = Category::findOrFail($request->category_id);
        
        // Final verification of SKU on server side to avoid race conditions 
        // (though in a simple system we just trust the request or regenerate)
        // Here we'll just check if it matches the expected sequence and increment
        
        Item::create($request->all());

        // Increment the category's next number
        $category->increment('next_num');

        return redirect()->route('items.index');
    }

    public function show(Item $item)
    {
        $item->load([
            'category', 
            'unit', 
            'warehouses.warehouse', 
            'movements.warehouse', 
            'movements.user'
        ]);

        return Inertia::render('Items/Show', [
            'item' => $item,
        ]);
    }

    public function edit(Item $item)
    {
        return Inertia::render('Items/Edit', [
            'item' => $item,
            'categories' => Category::all()->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'prefix' => $category->prefix,
                    'path_name' => $category->path_name,
                ];
            }),
            'units' => Unit::all(),
        ]);
    }

    public function update(Request $request, Item $item)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:items,sku,' . $item->id,
            'unit_cost' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'unit_id' => 'required|exists:units,id',
            'is_vatable' => 'boolean',
        ]);

        $item->update($request->all());

        return redirect()->route('items.index');
    }

    public function destroy(Item $item)
    {
        $item->delete();

        return redirect()->route('items.index');
    }
}
