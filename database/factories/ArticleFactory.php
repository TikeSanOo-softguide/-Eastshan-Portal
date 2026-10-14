<?php

namespace Database\Factories;

use App\Enums\ArticleCategory;
use App\Enums\PublicationStatus;
use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Article>
 */
class ArticleFactory extends Factory
{
    protected $model = Article::class;

    public function definition(): array
    {
        $number = fake()->unique()->numerify('##');

        return [
            'author_id' => User::factory(),
            'category' => fake()->randomElement(ArticleCategory::cases()),
            'slug' => Str::slug('sample-article-'.$number),
            'title' => [
                'en' => 'Sample article '.$number,
                'my' => 'နမူနာ ဆောင်းပါး '.$number,
                'zh' => '示例文章 '.$number,
            ],
            'body' => [
                'en' => 'Sample article body for layout preview. Not a real essay.',
                'my' => 'ပုံစံစမ်းဖို့ နမူနာ ဆောင်းပါးဖြစ်ပါတယ်။ တကယ့်စာမူမဟုတ်ပါ။',
                'zh' => '用于版式预览的示例文章，并非真实作品。',
            ],
            'cover' => null,
            'status' => PublicationStatus::Published,
            'published_at' => now()->subDays(fake()->numberBetween(1, 40)),
        ];
    }
}
