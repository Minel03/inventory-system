<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnitController extends Controller
{
    public function index()
    {
        return Inertia::render('Units/Index', [
            'units' => Unit::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:units,name|max:255',
            'abbreviation' => 'required|string|unique:units,abbreviation|max:50',
        ]);

        Unit::create($request->all());

        return redirect()->route('units.index')->with('success', 'Unit created successfully.');
    }

    public function update(Request $request, Unit $unit)
    {
        $request->validate([
            'name' => 'required|string|unique:units,name,' . $unit->id . '|max:255',
            'abbreviation' => 'required|string|unique:units,abbreviation,' . $unit->id . '|max:50',
        ]);

        $unit->update($request->all());

        return redirect()->route('units.index')->with('success', 'Unit updated successfully.');
    }

    public function destroy(Unit $unit)
    {
        // Check if there are items using this unit before deleting
        if ($unit->items()->count() > 0) {
            return back()->withErrors(['unit' => 'Cannot delete unit that is currently in use by items.']);
        }

        $unit->delete();

        return redirect()->route('units.index')->with('success', 'Unit deleted successfully.');
    }
}
