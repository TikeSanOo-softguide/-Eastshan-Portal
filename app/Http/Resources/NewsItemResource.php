<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\NewsItem */
class NewsItemResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'source_name' => $this->source_name,
            'source_url' => $this->source_url,
            'published_at' => $this->published_at?->toIso8601String(),
            'href' => '/news',
            'category' => $this->whenLoaded('category', fn () => $this->category
                ? (new CategoryResource($this->category))->resolve()
                : null),
        ];
    }
}
