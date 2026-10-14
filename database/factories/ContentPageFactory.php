<?php

namespace Database\Factories;

use App\Enums\ContentSection;
use App\Models\ContentPage;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ContentPage>
 */
class ContentPageFactory extends Factory
{
    protected $model = ContentPage::class;

    public function definition(): array
    {
        $en = 'Sample '.fake()->unique()->words(3, true);
        $section = fake()->randomElement(ContentSection::cases());

        return [
            'section' => $section,
            'slug' => Str::slug($section->value.'-'.$en),
            'title' => [
                'en' => $en,
                'my' => 'နမူနာ စာမျက်နှာ '.fake()->unique()->numerify('##'),
                'zh' => '示例页面 '.fake()->unique()->numerify('##'),
            ],
            'body' => [
                'en' => 'Sample page body for layout preview. Not a factual account.',
                'my' => 'ပုံစံစမ်းဖို့ နမူနာ စာသားဖြစ်ပါတယ်။ မှတ်တမ်းမှတ်ရာ မဟုတ်ပါ။',
                'zh' => '用于版式预览的示例正文，并非事实记述。',
            ],
            'cover' => null,
            'is_published' => true,
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}
