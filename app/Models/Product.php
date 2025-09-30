<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'sku',
        'barcode',
        'name',
        'category_id',
        'supplier_id',
        'brand',
        'description',
        'unit_measure',
        'reorder_level',
        'cost_price',
        'sell_price',
        'vat_included',
        'expiry_date',
        'batch_number',
        'tags'
    ];

    protected $casts = [
        'vat_included' => 'boolean',
        'expiry_date' => 'date',
        'tags' => 'array',
        'cost_price' => 'decimal:2',
        'sell_price' => 'decimal:2'
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    public function getCurrentStockAttribute()
    {
        return $this->stockMovements()
            ->where('type', 'In')
            ->sum('quantity') -
            $this->stockMovements()
            ->where('type', 'Out')
            ->sum('quantity');
    }

    public function getIsLowStockAttribute()
    {
        return $this->current_stock <= $this->reorder_level;
    }

    public function getFormattedPriceAttribute()
    {
        return '₱' . number_format((float) $this->sell_price, 2);
    }

    public function getFormattedCostAttribute()
    {
        return '₱' . number_format((float) $this->cost_price, 2);
    }
}
