<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseRequisition extends Model
{
    protected $fillable = [
        'pr_number',
        'date',
        'items',
        'status'
    ];

    protected $casts = [
        'date' => 'date',
        'items' => 'array'
    ];

    public function purchaseOrders(): HasMany
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    public function getTotalAmountAttribute()
    {
        $total = 0;
        foreach ($this->items as $item) {
            $product = Product::find($item['product_id']);
            if ($product) {
                $total += $product->cost_price * $item['quantity'];
            }
        }
        return $total;
    }
}
