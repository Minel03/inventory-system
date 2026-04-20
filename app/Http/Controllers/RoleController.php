<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        return Inertia::render('Configuration/Roles/Index', [
            'roles' => Role::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Configuration/Roles/Edit', [
            'role' => new Role,
            'availablePermissions' => $this->getAvailablePermissions(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'nullable|array',
        ]);

        Role::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'permissions' => $validated['permissions'] ?? [],
        ]);

        return redirect()->route('roles.index')->with('success', 'Role created successfully.');
    }

    public function edit(Role $role)
    {
        return Inertia::render('Configuration/Roles/Edit', [
            'role' => $role,
            'availablePermissions' => $this->getAvailablePermissions(),
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'nullable|array',
        ]);

        $role->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'permissions' => $validated['permissions'] ?? [],
        ]);

        return redirect()->route('roles.index')->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role)
    {
        if ($role->users()->count() > 0) {
            return back()->withErrors(['role' => 'Cannot delete role assigned to users.']);
        }

        $role->delete();

        return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
    }

    private function getAvailablePermissions()
    {
        return [
            ['id' => 'view_purchases', 'name' => 'View Purchases', 'group' => 'Purchases'],
            ['id' => 'create_pr', 'name' => 'Create PR', 'group' => 'Purchases'],
            ['id' => 'approve_pr', 'name' => 'Approve PR', 'group' => 'Purchases'],
            ['id' => 'approve_po_l1', 'name' => 'Approve PO (L1)', 'group' => 'Purchases'],
            ['id' => 'approve_po_l2', 'name' => 'Approve PO (L2)', 'group' => 'Purchases'],
            ['id' => 'receive_goods', 'name' => 'Receive Goods', 'group' => 'Purchases'],
            ['id' => 'manage_items', 'name' => 'Manage Items/Categories', 'group' => 'Inventory'],
            ['id' => 'manage_users', 'name' => 'Manage Users', 'group' => 'Administration'],
            ['id' => 'manage_settings', 'name' => 'Manage System Settings', 'group' => 'Administration'],
        ];
    }
}
