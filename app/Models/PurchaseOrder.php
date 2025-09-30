<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseOrder extends Model
{
    protected $fillable = [
        'po_number',
        'supplier_id',
        'date',
        'items',
        'status',
        'purchase_requisition_id'
    ];

    protected $casts = [
        'date' => 'date',
        'items' => 'array'
    ];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function purchaseRequisition(): BelongsTo
    {
        return $this->belongsTo(PurchaseRequisition::class);
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class, 'reference_no', 'po_number');
    }

    public function getTotalAmountAttribute()
    {
        $items = $this->items;

        // Ensure $items is an array
        if (is_string($items)) {
            try {
                $items = json_decode($items, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    return 0; // Return 0 or handle as needed
                }
            } catch (\Exception $e) {
                return 0;
            }
        }

        if (!is_array($items)) {
            return 0; // Return 0 or handle as needed
        }

        $total = 0;
        foreach ($items as $item) {
            $product = Product::find($item['product_id']);
            if ($product) {
                $total += $product->cost_price * $item['quantity'];
            }
        }
        return $total;
    }
}
