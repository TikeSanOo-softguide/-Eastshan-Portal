<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\InfrastructureItem */
class InfrastructureItemResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $stats = is_array($this->stats) ? $this->stats : [];

        return [
            'id' => $this->id,
            'name' => $this->name,
            'category' => $this->category->value,
            'status' => $this->status->value,
            'year' => $this->year,
            'stats' => $stats,
            'stat_bars' => $this->statBars($stats),
            'township' => $this->whenLoaded('township', fn () => [
                'id' => $this->township->id,
                'name' => $this->township->name,
                'slug' => $this->township->slug,
            ]),
        ];
    }

    /**
     * @param  array<string, mixed>  $stats
     * @return list<array{key: string, value: float|int, max: float|int, percent: float}>
     */
    private function statBars(array $stats): array
    {
        if ($stats === []) {
            return [];
        }

        $numeric = collect($stats)
            ->filter(fn ($value) => is_numeric($value))
            ->map(fn ($value) => 0 + $value);

        if ($numeric->isEmpty()) {
            return [];
        }

        $max = max(1, (float) $numeric->max());

        return $numeric
            ->map(fn ($value, $key) => [
                'key' => (string) $key,
                'value' => $value,
                'max' => $max,
                'percent' => round(min(100, ((float) $value / $max) * 100), 1),
            ])
            ->values()
            ->all();
    }
}
