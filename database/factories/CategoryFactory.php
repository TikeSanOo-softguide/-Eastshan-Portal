<?php

namespace Database\Factories;

use App\Enums\CategoryType;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        $en = 'Sample '.fake()->unique()->word();
        $type = fake()->randomElement(CategoryType::cases());

        return [
            'type' => $type,
            'name' => [
                'en' => $en,
                'my' => 'နမူနာ အမျိုးအစား '.fake()->unique()->numerify('##'),
                'zh' => '示例分类 '.fake()->unique()->numerify('##'),
            ],
            'slug' => Str::slug($type->value.'-'.$en),
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}
