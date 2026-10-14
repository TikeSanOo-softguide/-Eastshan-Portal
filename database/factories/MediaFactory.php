<?php

namespace Database\Factories;

use App\Models\Media;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Media>
 */
class MediaFactory extends Factory
{
    protected $model = Media::class;

    public function definition(): array
    {
        $name = 'sample-'.fake()->unique()->numerify('###').'.png';

        return [
            'user_id' => User::factory(),
            'mediable_type' => null,
            'mediable_id' => null,
            'disk' => 'public',
            'path' => 'samples/'.$name,
            'file_name' => $name,
            'mime_type' => 'image/png',
            'size' => fake()->numberBetween(1000, 50000),
            'alt' => [
                'en' => 'Sample image',
                'my' => 'နမူနာ ပုံ',
                'zh' => '示例图片',
            ],
            'sort_order' => 0,
        ];
    }
}
