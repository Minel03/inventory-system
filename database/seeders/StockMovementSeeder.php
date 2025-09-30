<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StockMovement;
use App\Models\Product;
use App\Models\Warehouse;
use App\Models\Supplier;
use Carbon\Carbon;

class StockMovementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure there are products, warehouses, and suppliers
        $products = Product::all();
        $warehouses = Warehouse::all();
        $suppliers = Supplier::all();

        if ($products->isEmpty() || $warehouses->isEmpty() || $suppliers->isEmpty()) {
            $this->command->info('Please seed Products, Warehouses, and Suppliers tables first.');
            return;
        }

        // Sample stock movement data
        $stockMovements = [
            [
                'product_id' => $products->random()->id,
                'warehouse_id' => $warehouses->random()->id,
                'type' => 'In',
                'reference_no' => 'PO-001',
                'supplier_id' => $suppliers->random()->id,
                'date' => Carbon::now()->subDays(10),
                'quantity' => 100,
                'unit_cost' => 10.50,
                'expiry_date' => Carbon::now()->addYear(),
                'destination' => null,
                'reason' => 'Purchase Order Received',
                'adjustment_diff' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_id' => $products->random()->id,
                'warehouse_id' => $warehouses->random()->id,
                'type' => 'Out',
                'reference_no' => 'INV-001',
                'supplier_id' => null,
                'date' => Carbon::now()->subDays(8),
                'quantity' => 20,
                'unit_cost' => 10.50,
                'expiry_date' => null,
                'destination' => 'Customer ABC',
                'reason' => 'Sale',
                'adjustment_diff' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_id' => $products->random()->id,
                'warehouse_id' => $warehouses->random()->id,
                'type' => 'Adjustment',
                'reference_no' => 'ADJ-001',
                'supplier_id' => null,
                'date' => Carbon::now()->subDays(5),
                'quantity' => 10,
                'unit_cost' => 12.00,
                'expiry_date' => null,
                'destination' => null,
                'reason' => 'Damaged Stock',
                'adjustment_diff' => -10,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_id' => $products->random()->id,
                'warehouse_id' => $warehouses->random()->id,
                'type' => 'In',
                'reference_no' => 'PO-002',
                'supplier_id' => $suppliers->random()->id,
                'date' => Carbon::now()->subDays(7),
                'quantity' => 50,
                'unit_cost' => 15.75,
                'expiry_date' => Carbon::now()->addMonths(6),
                'destination' => null,
                'reason' => 'Restock',
                'adjustment_diff' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_id' => $products->random()->id,
                'warehouse_id' => $warehouses->random()->id,
                'type' => 'Out',
                'reference_no' => 'TR-001',
                'supplier_id' => null,
                'date' => Carbon::now()->subDays(4),
                'quantity' => 30,
                'unit_cost' => 10.00,
                'expiry_date' => null,
                'destination' => 'Branch XYZ',
                'reason' => 'Transfer',
                'adjustment_diff' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_id' => $products->random()->id,
                'warehouse_id' => $warehouses->random()->id,
                'type' => 'Adjustment',
                'reference_no' => 'ADJ-002',
                'supplier_id' => null,
                'date' => Carbon::now()->subDays(3),
                'quantity' => 5,
                'unit_cost' => 8.00,
                'expiry_date' => null,
                'destination' => 'Disposal',
                'reason' => 'Expired Stock',
                'adjustment_diff' => -5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_id' => $products->random()->id,
                'warehouse_id' => $warehouses->random()->id,
                'type' => 'In',
                'reference_no' => 'PO-003',
                'supplier_id' => $suppliers->random()->id,
                'date' => Carbon::now()->subDays(2),
                'quantity' => 200,
                'unit_cost' => 5.25,
                'expiry_date' => null,
                'destination' => null,
                'reason' => 'Bulk Purchase',
                'adjustment_diff' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_id' => $products->random()->id,
                'warehouse_id' => $warehouses->random()->id,
                'type' => 'Out',
                'reference_no' => 'INV-002',
                'supplier_id' => null,
                'date' => Carbon::now()->subDays(1),
                'quantity' => 15,
                'unit_cost' => 20.00,
                'expiry_date' => null,
                'destination' => 'Customer DEF',
                'reason' => 'Sale',
                'adjustment_diff' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_id' => $products->random()->id,
                'warehouse_id' => $warehouses->random()->id,
                'type' => 'In',
                'reference_no' => 'PO-004',
                'supplier_id' => $suppliers->random()->id,
                'date' => Carbon::now(),
                'quantity' => 80,
                'unit_cost' => 7.50,
                'expiry_date' => Carbon::now()->addYears(2),
                'destination' => null,
                'reason' => 'New Stock',
                'adjustment_diff' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_id' => $products->random()->id,
                'warehouse_id' => $warehouses->random()->id,
                'type' => 'Adjustment',
                'reference_no' => 'ADJ-003',
                'supplier_id' => null,
                'date' => Carbon::now(),
                'quantity' => 25,
                'unit_cost' => 9.00,
                'expiry_date' => null,
                'destination' => null,
                'reason' => 'Stock Count Correction',
                'adjustment_diff' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insert the stock movements
        foreach ($stockMovements as $movement) {
            StockMovement::create($movement);
        }
    }
}
