<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'sku',
        'name',
        'brand',
        'description',
        'category_id',
        'supplier_id',
        'unit_measure',
        'cost_price',
        'sell_price',
        'vat_included',
        'reorder_level',
        'expiry_date',
        'batch_number',
        'tags',
    ];

    // Cast the tags field to an array
    protected $casts = [
        'tags' => 'array',
    ];

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    // Add other attributes or methods as needed
    public function getFormattedPriceAttribute()
    {
        return '₱' . number_format($this->sell_price, 2);
    }

    public function getCurrentStockAttribute()
    {
        $inStock = $this->stockMovements()->where('type', 'In')->sum('quantity');
        $outStock = $this->stockMovements()->where('type', 'Out')->sum('quantity');
        return $inStock - $outStock;
    }

    public function getIsLowStockAttribute()
    {
        return $this->current_stock <= $this->reorder_level;
    }
}
