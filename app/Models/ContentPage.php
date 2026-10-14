<?php

namespace App\Models;

use App\Enums\ContentSection;
use App\Models\Concerns\HasLocalizedContent;
use App\Models\Concerns\OrdersBySort;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContentPage extends Model
{
    /** @use HasFactory<\Database\Factories\ContentPageFactory> */
    use HasFactory, HasLocalizedContent, OrdersBySort;

    public array $translatable = ['title', 'body'];

    protected $fillable = [
        'section',
        'slug',
        'title',
        'body',
        'cover',
        'is_published',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'section' => ContentSection::class,
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }
}
