<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'prefix',
        'parent_id',
        'next_num',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    /**
     * Get the full hierarchy path name.
     */
    public function getPathNameAttribute(): string
    {
        if ($this->parent) {
            return $this->parent->path_name . ' > ' . $this->name;
        }

        return $this->name;
    }
}
