<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;

trait OrdersBySort
{
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy($query->getModel()->getTable().'.sort_order')
            ->orderBy($query->getModel()->getTable().'.id');
    }
}
