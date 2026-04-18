<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'category_prefix_length',
                'value' => '4',
                'group' => 'categories',
            ],
            [
                'key' => 'sku_padding',
                'value' => '4',
                'group' => 'categories',
            ],
            [
                'key' => 'sku_random_length',
                'value' => '4',
                'group' => 'items',
            ],
            [
                'key' => 'company_name',
                'value' => 'Inventory System',
                'group' => 'general',
            ],
        ];

        foreach ($settings as $setting) {
            Setting::set($setting['key'], $setting['value'], $setting['group']);
        }
    }
}
