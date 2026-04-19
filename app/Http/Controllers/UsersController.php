<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UsersController extends Controller
{
    public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => User::with('warehouse')->get(),
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', [
            'user' => $user,
            'warehouses' => Warehouse::all(['id', 'name']),
            'roles' => [
                ['id' => 'admin', 'name' => 'Administrator'],
                ['id' => 'manager', 'name' => 'Manager (PR Approver)'],
                ['id' => 'buyer', 'name' => 'Buyer (Supplier Canvassing)'],
                ['id' => 'approver_l1', 'name' => 'Level 1 Approver'],
                ['id' => 'approver_l2', 'name' => 'Level 2 Approver'],
                ['id' => 'warehouse', 'name' => 'Warehouse Staff'],
            ],
        ]);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->all();

        // Convert 'none' string from frontend Select to null for DB
        if (isset($data['warehouse_id']) && $data['warehouse_id'] === 'none') {
            $data['warehouse_id'] = null;
        }

        $validated = validator($data, [
            'role' => 'required|string',
            'warehouse_id' => 'nullable|exists:warehouses,id',
        ])->validate();

        $user->update($validated);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }
}
