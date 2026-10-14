<?php

namespace App\Models;

use App\Enums\CategoryType;
use App\Models\Concerns\HasLocalizedContent;
use App\Models\Concerns\OrdersBySort;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory, HasLocalizedContent, OrdersBySort;

    public array $translatable = ['name'];

    protected $fillable = [
        'type',
        'name',
        'slug',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'type' => CategoryType::class,
            'sort_order' => 'integer',
        ];
    }

    public function newsItems(): HasMany
    {
        return $this->hasMany(NewsItem::class);
    }
}
