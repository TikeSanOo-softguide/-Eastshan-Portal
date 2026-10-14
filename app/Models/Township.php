<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedContent;
use App\Models\Concerns\OrdersBySort;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Township extends Model
{
    /** @use HasFactory<\Database\Factories\TownshipFactory> */
    use HasFactory, HasLocalizedContent, OrdersBySort;

    public array $translatable = ['name'];

    protected $fillable = [
        'name',
        'slug',
        'population',
        'area_km2',
        'lat',
        'lng',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'population' => 'integer',
            'area_km2' => 'decimal:2',
            'lat' => 'decimal:7',
            'lng' => 'decimal:7',
            'sort_order' => 'integer',
        ];
    }

    public function infrastructureItems(): HasMany
    {
        return $this->hasMany(InfrastructureItem::class);
    }
}
