<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Administrator',
                'slug' => 'admin',
                'permissions' => [
                    'view_purchases', 'create_pr', 'approve_pr', 
                    'approve_po_l1', 'approve_po_l2', 'receive_goods', 
                    'manage_users', 'manage_settings', 'manage_items'
                ],
            ],
            [
                'name' => 'Manager',
                'slug' => 'manager',
                'permissions' => [
                    'view_purchases', 'create_pr', 'approve_pr', 
                    'manage_items'
                ],
            ],
            [
                'name' => 'Buyer',
                'slug' => 'buyer',
                'permissions' => [
                    'view_purchases', 'manage_items'
                ],
            ],
            [
                'name' => 'Level 1 Approver',
                'slug' => 'approver_l1',
                'permissions' => [
                    'view_purchases', 'approve_po_l1'
                ],
            ],
            [
                'name' => 'Level 2 Approver',
                'slug' => 'approver_l2',
                'permissions' => [
                    'view_purchases', 'approve_po_l2'
                ],
            ],
            [
                'name' => 'Warehouse Staff',
                'slug' => 'warehouse',
                'permissions' => [
                    'view_purchases', 'receive_goods'
                ],
            ],
            [
                'name' => 'Staff',
                'slug' => 'staff',
                'permissions' => [
                    'view_purchases', 'manage_items'
                ],
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(['slug' => $role['slug']], $role);
        }
    }
}
