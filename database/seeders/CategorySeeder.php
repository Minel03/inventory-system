<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Electronics', 'prefix' => 'ELEC'],
            ['name' => 'Furniture', 'prefix' => 'FURN'],
            ['name' => 'Office Supplies', 'prefix' => 'OFFC'],
            ['name' => 'Hardware', 'prefix' => 'HARD'],
            ['name' => 'Clothing', 'prefix' => 'CLOT'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
