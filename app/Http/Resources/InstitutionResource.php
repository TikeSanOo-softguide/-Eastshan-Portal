<?php

namespace App\Http\Resources;

use App\Support\RichText;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Institution */
class InstitutionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'type' => $this->type->value,
            'description_html' => RichText::toSafeHtml($this->description),
            'description_excerpt' => RichText::toPlainExcerpt($this->description),
            'address' => $this->address,
            'phone' => $this->phone,
            'email' => $this->email,
            'logo' => $this->logo ? '/'.$this->logo : null,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'parent' => $this->whenLoaded('parent', fn () => $this->parent ? [
                'id' => $this->parent->id,
                'name' => $this->parent->name,
                'slug' => $this->parent->slug,
            ] : null),
            'children' => InstitutionTreeResource::collection($this->whenLoaded('children')),
            'leaders' => LeaderResource::collection($this->whenLoaded('leaders')),
        ];
    }
}
