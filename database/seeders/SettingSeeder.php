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
                'group' => 'items',
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
            [
                'key' => 'po_prefix',
                'value' => 'PO',
                'group' => 'numbering',
            ],
            [
                'key' => 'po_start_number',
                'value' => '1',
                'group' => 'numbering',
            ],
            [
                'key' => 'pr_prefix',
                'value' => 'PR',
                'group' => 'numbering',
            ],
            [
                'key' => 'pr_start_number',
                'value' => '1',
                'group' => 'numbering',
            ],
        ];

        foreach ($settings as $setting) {
            Setting::set($setting['key'], $setting['value'], $setting['group']);
        }
    }
}
