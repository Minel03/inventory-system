<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    protected $fillable = [
        'name',
        'address',
        'is_main',
    ];

    protected $casts = [
        'is_main' => 'boolean',
    ];

    public function items()
    {
        return $this->hasMany(WarehouseItem::class);
    }

    public function movements()
    {
        return $this->hasMany(InventoryMovement::class);
    }
}
