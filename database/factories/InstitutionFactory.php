<?php

namespace Database\Factories;

use App\Enums\InstitutionType;
use App\Models\Institution;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Institution>
 */
class InstitutionFactory extends Factory
{
    protected $model = Institution::class;

    public function definition(): array
    {
        $en = 'Sample '.fake()->unique()->words(2, true);

        return [
            'parent_id' => null,
            'type' => fake()->randomElement(InstitutionType::cases()),
            'name' => [
                'en' => $en,
                'my' => 'နမူနာ ဌာန '.fake()->unique()->numerify('##'),
                'zh' => '示例机构 '.fake()->unique()->numerify('##'),
            ],
            'description' => [
                'en' => 'Sample institution description. Not an official statement.',
                'my' => 'နမူနာ ဌာနဖော်ပြချက်ဖြစ်ပါတယ်။ တရားဝင်ကြေညာချက် မဟုတ်ပါ။',
                'zh' => '示例机构简介，并非正式声明。',
            ],
            'slug' => Str::slug($en),
            'address' => 'Sample address '.fake()->buildingNumber(),
            'phone' => fake()->numerify('09#########'),
            'email' => fake()->unique()->safeEmail(),
            'logo' => null,
            'sort_order' => fake()->numberBetween(0, 20),
            'is_active' => true,
        ];
    }
}
