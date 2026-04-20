<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockTransfer extends Model
{
    protected $fillable = [
        'purchase_item_id',
        'item_id',
        'from_warehouse',
        'to_warehouse',
        'quantity',
        'status',
    ];

    public function purchaseItem()
    {
        return $this->belongsTo(PurchaseItem::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function fromWarehouse()
    {
        return $this->belongsTo(Warehouse::class, 'from_warehouse');
    }

    public function toWarehouse()
    {
        return $this->belongsTo(Warehouse::class, 'to_warehouse');
    }
}
