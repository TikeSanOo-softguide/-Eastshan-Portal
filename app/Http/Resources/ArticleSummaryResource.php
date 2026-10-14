<?php

namespace App\Http\Resources;

use App\Support\ReadingTime;
use App\Support\RichText;
use App\Support\TranslationAvailability;
use App\Support\WebpVariant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Article */
class ArticleSummaryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'category' => $this->category->value,
            'title' => $this->title,
            'excerpt' => RichText::toPlainExcerpt($this->body, 140),
            'cover' => $this->cover ? '/'.$this->cover : null,
            'cover_webp' => WebpVariant::siblingUrl($this->cover),
            'published_at' => $this->published_at?->toIso8601String(),
            'reading_time' => ReadingTime::minutes($this->body),
            'available_locales' => TranslationAvailability::localesFor($this->resource, ['title', 'body']),
            'href' => '/articles/'.$this->category->value.'/'.$this->slug,
            'author' => $this->whenLoaded('author', fn () => $this->author ? [
                'id' => $this->author->id,
                'name' => $this->author->name,
            ] : null),
        ];
    }
}
