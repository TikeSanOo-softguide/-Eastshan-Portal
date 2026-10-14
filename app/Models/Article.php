<?php

namespace App\Models;

use App\Enums\ArticleCategory;
use App\Enums\PublicationStatus;
use App\Models\Concerns\HasLocalizedContent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Article extends Model
{
    /** @use HasFactory<\Database\Factories\ArticleFactory> */
    use HasFactory, HasLocalizedContent;

    public array $translatable = ['title', 'body'];

    protected $fillable = [
        'author_id',
        'category',
        'slug',
        'title',
        'body',
        'cover',
        'status',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'category' => ArticleCategory::class,
            'status' => PublicationStatus::class,
            'published_at' => 'datetime',
        ];
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', PublicationStatus::Published)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByDesc('published_at')->orderByDesc('id');
    }
}
