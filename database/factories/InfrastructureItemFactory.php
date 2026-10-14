<?php

namespace Database\Factories;

use App\Enums\InfrastructureCategory;
use App\Enums\InfrastructureStatus;
use App\Models\InfrastructureItem;
use App\Models\Township;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<InfrastructureItem>
 */
class InfrastructureItemFactory extends Factory
{
    protected $model = InfrastructureItem::class;

    public function definition(): array
    {
        return [
            'township_id' => Township::factory(),
            'category' => fake()->randomElement(InfrastructureCategory::cases()),
            'name' => [
                'en' => 'Sample '.fake()->unique()->words(2, true),
                'my' => 'နမူနာ အဆောက်အအုံ '.fake()->unique()->numerify('##'),
                'zh' => '示例设施 '.fake()->unique()->numerify('##'),
            ],
            'status' => fake()->randomElement(InfrastructureStatus::cases()),
            'stats' => ['sample_count' => fake()->numberBetween(1, 40)],
            'year' => fake()->numberBetween(2015, 2026),
            'sort_order' => fake()->numberBetween(0, 20),
        ];
    }
}
