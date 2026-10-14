<?php

namespace App\Http\Resources;

use App\Support\RichText;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\ContentPage */
class ContentPageSummaryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'section' => $this->section->value,
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => RichText::toPlainExcerpt($this->body),
            'cover' => $this->cover ? '/'.$this->cover : null,
            'href' => $this->sectionHref(),
        ];
    }

    private function sectionHref(): string
    {
        return match ($this->section->value) {
            'heritage' => '/heritage',
            'socio_economy' => '/about/socio-economy',
            default => '/about/'.$this->section->value,
        };
    }
}
