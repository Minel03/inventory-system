<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UsersController extends Controller
{
    public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => User::with(['warehouse', 'assignedRole'])->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create', [
            'warehouses' => Warehouse::all(['id', 'name']),
            'roles' => Role::all(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        if (isset($data['warehouse_id']) && $data['warehouse_id'] === 'none') {
            $data['warehouse_id'] = null;
        }

        $validated = validator($data, [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role_id' => 'required|exists:roles,id',
            'warehouse_id' => 'nullable|exists:warehouses,id',
        ])->validate();

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role_id' => $validated['role_id'],
            'warehouse_id' => $validated['warehouse_id'] ?? null,
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', [
            'user' => $user->load('assignedRole'),
            'warehouses' => Warehouse::all(['id', 'name']),
            'roles' => Role::all(['id', 'name']),
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
            'role_id' => 'required|exists:roles,id',
            'warehouse_id' => 'nullable|exists:warehouses,id',
        ])->validate();

        $user->update($validated);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }
}
