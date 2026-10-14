<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\NewsItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<NewsItem>
 */
class NewsItemFactory extends Factory
{
    protected $model = NewsItem::class;

    public function definition(): array
    {
        return [
            'category_id' => Category::factory()->state([
                'type' => \App\Enums\CategoryType::News,
            ]),
            'title' => [
                'en' => 'Sample news '.fake()->unique()->numerify('##'),
                'my' => 'နမူနာ သတင်း '.fake()->unique()->numerify('##'),
                'zh' => '示例新闻 '.fake()->unique()->numerify('##'),
            ],
            'excerpt' => [
                'en' => 'Sample excerpt. Not a report of a real event.',
                'my' => 'နမူနာ အကျဉ်းချုပ်ဖြစ်ပါတယ်။ တကယ့်ဖြစ်ရပ်မဟုတ်ပါ။',
                'zh' => '示例摘要，并非真实事件。',
            ],
            'source_name' => 'Sample Desk',
            'source_url' => 'https://example.com/sample-news/'.fake()->unique()->numerify('###'),
            'published_at' => now()->subDays(fake()->numberBetween(1, 40)),
        ];
    }
}
