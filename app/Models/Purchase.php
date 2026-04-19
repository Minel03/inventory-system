<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $fillable = [
        'pr_number',
        'po_number',
        'supplier_id',
        'purchase_date',
        'warehouse_id',
        'expected_delivery_date',
        'status',
        'notes',
        'l1_approved_by',
        'l1_approved_at',
        'l2_approved_by',
        'l2_approved_at',
    ];

    public function l1Approver()
    {
        return $this->belongsTo(User::class, 'l1_approved_by');
    }

    public function l2Approver()
    {
        return $this->belongsTo(User::class, 'l2_approved_by');
    }

    public function items()
    {
        return $this->hasMany(PurchaseItem::class);
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}
