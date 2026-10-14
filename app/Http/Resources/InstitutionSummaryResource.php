<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Institution */
class InstitutionSummaryResource extends JsonResource
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
            'logo' => $this->logo ? '/'.$this->logo : null,
            'address' => $this->address,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'leaders_count' => $this->whenCounted('leaders'),
            'children_count' => $this->whenCounted('children'),
        ];
    }
}
