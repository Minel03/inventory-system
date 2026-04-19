<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WarehouseController extends Controller
{
    public function index()
    {
        $warehouses = \App\Models\Warehouse::all();

        return \Inertia\Inertia::render('Warehouses/Index', [
            'warehouses' => $warehouses,
        ]);
    }

    public function show(\App\Models\Warehouse $warehouse)
    {
        $warehouse->load([
            'items.item.unit',
            'items.item.category'
        ]);

        return \Inertia\Inertia::render('Warehouses/Show', [
            'warehouse' => $warehouse,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'is_main' => 'boolean',
        ]);

        if (!empty($validated['is_main'])) {
            $hasMain = \App\Models\Warehouse::where('is_main', true)->exists();
            if ($hasMain) {
                return back()->withErrors(['is_main' => 'A main warehouse already exists. There can only be one main warehouse.']);
            }
        }

        \App\Models\Warehouse::create($validated);

        return redirect()->back()->with('success', 'Warehouse created successfully.');
    }

    public function update(Request $request, \App\Models\Warehouse $warehouse)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'is_main' => 'boolean',
        ]);

        if (!empty($validated['is_main'])) {
            $hasMain = \App\Models\Warehouse::where('is_main', true)->where('id', '!=', $warehouse->id)->exists();
            if ($hasMain) {
                return back()->withErrors(['is_main' => 'A main warehouse already exists. There can only be one main warehouse.']);
            }
        }

        $warehouse->update($validated);

        return redirect()->back()->with('success', 'Warehouse updated successfully.');
    }

    public function destroy(\App\Models\Warehouse $warehouse)
    {
        $warehouse->delete();

        return redirect()->back()->with('success', 'Warehouse deleted successfully.');
    }
}
