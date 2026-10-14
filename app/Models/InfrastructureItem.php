<?php

namespace App\Models;

use App\Enums\InfrastructureCategory;
use App\Enums\InfrastructureStatus;
use App\Models\Concerns\HasLocalizedContent;
use App\Models\Concerns\OrdersBySort;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InfrastructureItem extends Model
{
    /** @use HasFactory<\Database\Factories\InfrastructureItemFactory> */
    use HasFactory, HasLocalizedContent, OrdersBySort;

    public array $translatable = ['name'];

    protected $fillable = [
        'township_id',
        'category',
        'name',
        'status',
        'stats',
        'year',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'category' => InfrastructureCategory::class,
            'status' => InfrastructureStatus::class,
            'stats' => 'array',
            'year' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    public function township(): BelongsTo
    {
        return $this->belongsTo(Township::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', InfrastructureStatus::Operational);
    }
}
