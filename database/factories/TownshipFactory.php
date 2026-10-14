<?php

namespace Database\Factories;

use App\Models\Township;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Township>
 */
class TownshipFactory extends Factory
{
    protected $model = Township::class;

    public function definition(): array
    {
        $en = 'Sample '.fake()->unique()->city();

        return [
            'name' => [
                'en' => $en,
                'my' => 'နမူနာ မြို့နယ် '.fake()->unique()->numerify('##'),
                'zh' => '示例乡镇 '.fake()->unique()->numerify('##'),
            ],
            'slug' => Str::slug($en),
            'population' => fake()->numberBetween(8000, 60000),
            'area_km2' => fake()->randomFloat(2, 40, 500),
            'lat' => fake()->randomFloat(7, 20, 23),
            'lng' => fake()->randomFloat(7, 98, 101),
            'sort_order' => fake()->numberBetween(0, 20),
        ];
    }
}
