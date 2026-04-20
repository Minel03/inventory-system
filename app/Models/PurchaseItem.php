<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseItem extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'purchase_id',
        'item_id',
        'quantity',
        'quantity_transferred',
        'quantity_ordered',
        'quantity_received',
        'price',
    ];

    public function transfers()
    {
        return $this->hasMany(StockTransfer::class, 'purchase_item_id');
    }

    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
