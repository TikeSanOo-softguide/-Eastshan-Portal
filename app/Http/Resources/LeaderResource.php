<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Leader */
class LeaderResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'position' => $this->position,
            'bio' => $this->bio,
            'photo' => $this->photo ? '/'.$this->photo : '/videos/leader-placeholder.jpg',
            'sort_order' => $this->sort_order,
            'institution' => $this->whenLoaded('institution', fn () => [
                'id' => $this->institution->id,
                'name' => $this->institution->name,
                'slug' => $this->institution->slug,
            ]),
        ];
    }
}
