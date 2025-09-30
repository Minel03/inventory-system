<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Supplier;
use App\Models\Warehouse;
use App\Models\Product;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Categories
        $categories = [
            ['name' => 'Food & Beverages'],
            ['name' => 'Electronics'],
            ['name' => 'Office Supplies'],
            ['name' => 'Clothing & Accessories'],
            ['name' => 'Health & Beauty'],
            ['name' => 'Home & Garden'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        // Create Suppliers
        $suppliers = [
            [
                'code' => 'SUP001',
                'company_name' => 'ABC Food Corporation',
                'contact_person' => 'John Smith',
                'tin' => '123-456-789-000',
                'address' => '123 Main Street, Manila, Philippines',
                'contact_number' => '+63 2 1234 5678',
                'email' => 'contact@abcfood.com',
                'payment_terms' => '30 days',
                'bank_details' => 'Bank: BPI, Account: 1234567890, Name: ABC Food Corp'
            ],
            [
                'code' => 'SUP002',
                'company_name' => 'Tech Solutions Inc.',
                'contact_person' => 'Jane Doe',
                'tin' => '987-654-321-000',
                'address' => '456 Tech Avenue, Makati, Philippines',
                'contact_number' => '+63 2 8765 4321',
                'email' => 'sales@techsolutions.com',
                'payment_terms' => '15 days',
                'bank_details' => 'Bank: BDO, Account: 0987654321, Name: Tech Solutions Inc'
            ],
            [
                'code' => 'SUP003',
                'company_name' => 'Office Depot Philippines',
                'contact_person' => 'Mike Johnson',
                'tin' => '456-789-123-000',
                'address' => '789 Business Park, Quezon City, Philippines',
                'contact_number' => '+63 2 5555 1234',
                'email' => 'orders@officedepot.ph',
                'payment_terms' => 'COD',
                'bank_details' => 'Bank: Metrobank, Account: 4567891230, Name: Office Depot PH'
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::create($supplier);
        }

        // Create Warehouses
        $warehouses = [
            [
                'name' => 'Main Warehouse',
                'location' => '123 Industrial Road, Laguna, Philippines'
            ],
            [
                'name' => 'North Branch',
                'location' => '456 North Avenue, Quezon City, Philippines'
            ],
            [
                'name' => 'South Branch',
                'location' => '789 South Road, Cebu, Philippines'
            ],
        ];

        foreach ($warehouses as $warehouse) {
            Warehouse::create($warehouse);
        }

        // Create Sample Products
        $products = [
            [
                'sku' => 'PROD001',
                'name' => 'Coca Cola 330ml',
                'category_id' => 1, // Food & Beverages
                'supplier_id' => 1, // ABC Food Corporation
                'brand' => 'Coca Cola',
                'description' => 'Classic Coca Cola soft drink in 330ml can',
                'unit_measure' => 'pcs',
                'reorder_level' => 50,
                'cost_price' => 15.00,
                'sell_price' => 20.00,
                'vat_included' => true,
                'expiry_date' => now()->addMonths(12),
                'batch_number' => 'BATCH001',
                'tags' => ['Fast-moving', 'Beverage']
            ],
            [
                'sku' => 'PROD002',
                'name' => 'Samsung Galaxy S21',
                'category_id' => 2, // Electronics
                'supplier_id' => 2, // Tech Solutions Inc.
                'brand' => 'Samsung',
                'description' => 'Latest Samsung Galaxy smartphone with 128GB storage',
                'unit_measure' => 'pcs',
                'reorder_level' => 5,
                'cost_price' => 25000.00,
                'sell_price' => 35000.00,
                'vat_included' => true,
                'tags' => ['High-value', 'Electronics']
            ],
            [
                'sku' => 'PROD003',
                'name' => 'A4 Bond Paper',
                'category_id' => 3, // Office Supplies
                'supplier_id' => 3, // Office Depot Philippines
                'brand' => 'Canon',
                'description' => 'White A4 size bond paper, 500 sheets per ream',
                'unit_measure' => 'ream',
                'reorder_level' => 20,
                'cost_price' => 120.00,
                'sell_price' => 150.00,
                'vat_included' => true,
                'tags' => ['Office', 'Stationery']
            ],
            [
                'sku' => 'PROD004',
                'name' => 'Blue Ink Pen',
                'category_id' => 3, // Office Supplies
                'supplier_id' => 3, // Office Depot Philippines
                'brand' => 'Pilot',
                'description' => 'Blue ballpoint pen with fine tip',
                'unit_measure' => 'pcs',
                'reorder_level' => 100,
                'cost_price' => 8.00,
                'sell_price' => 12.00,
                'vat_included' => true,
                'tags' => ['Fast-moving', 'Stationery']
            ],
            [
                'sku' => 'PROD005',
                'name' => 'Cotton T-Shirt',
                'category_id' => 4, // Clothing & Accessories
                'supplier_id' => 1, // ABC Food Corporation (example)
                'brand' => 'Generic',
                'description' => '100% cotton t-shirt, various sizes available',
                'unit_measure' => 'pcs',
                'reorder_level' => 30,
                'cost_price' => 150.00,
                'sell_price' => 250.00,
                'vat_included' => true,
                'tags' => ['Clothing', 'Cotton']
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
