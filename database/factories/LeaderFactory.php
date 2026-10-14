<?php

namespace Database\Factories;

use App\Models\Institution;
use App\Models\Leader;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Leader>
 */
class LeaderFactory extends Factory
{
    protected $model = Leader::class;

    public function definition(): array
    {
        return [
            'institution_id' => Institution::factory(),
            'name' => [
                'en' => 'Sample Leader '.fake()->unique()->lastName(),
                'my' => 'နမူနာ ခေါင်းဆောင် '.fake()->unique()->numerify('##'),
                'zh' => '示例负责人 '.fake()->unique()->numerify('##'),
            ],
            'position' => [
                'en' => 'Sample officer',
                'my' => 'နမူနာ တာဝန်ခံ',
                'zh' => '示例职务',
            ],
            'bio' => [
                'en' => 'Sample biography for layout preview. This is not a real person.',
                'my' => 'ပုံစံစမ်းဖို့ နမူနာ ကိုယ်ရေးအကျဉ်းဖြစ်ပါတယ်။ တကယ့်လူမဟုတ်ပါ။',
                'zh' => '用于版式预览的示例简介，并非真实人物。',
            ],
            'photo' => null,
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}
