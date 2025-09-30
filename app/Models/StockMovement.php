<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockMovement extends Model
{
    protected $fillable = [
        'product_id',
        'warehouse_id',
        'type',
        'reference_no',
        'supplier_id',
        'date',
        'quantity',
        'unit_cost',
        'expiry_date',
        'destination',
        'reason',
        'adjustment_diff'
    ];

    protected $casts = [
        'date' => 'date',
        'expiry_date' => 'date',
        'unit_cost' => 'decimal:2'
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function getTotalCostAttribute()
    {
        return $this->unit_cost * $this->quantity;
    }
}
