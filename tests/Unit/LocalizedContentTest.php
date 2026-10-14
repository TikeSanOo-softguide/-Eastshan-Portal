<?php

namespace Tests\Unit;

use App\Models\Concerns\HasLocalizedContent;
use Illuminate\Database\Eloquent\Model;
use Tests\TestCase;

class LocalizedContentTest extends TestCase
{
    public function test_missing_translations_fall_back_from_the_active_locale_to_my_then_en(): void
    {
        $record = new class extends Model
        {
            use HasLocalizedContent;

            protected $guarded = [];

            public $translatable = ['title'];
        };

        $record->replaceTranslations('title', [
            'en' => 'Eastshan office',
            'my' => 'အရှေ့ရှမ်းရုံး',
            'zh' => '东山办事处',
        ]);

        app()->setLocale('zh');
        $this->assertSame('东山办事处', $record->title);

        $record->replaceTranslations('title', [
            'en' => 'Eastshan office',
            'my' => 'အရှေ့ရှမ်းရုံး',
        ]);

        app()->setLocale('zh');
        $this->assertSame('အရှေ့ရှမ်းရုံး', $record->title);

        $record->replaceTranslations('title', [
            'en' => 'Eastshan office',
        ]);

        app()->setLocale('my');
        $this->assertSame('Eastshan office', $record->title);

        app()->setLocale('zh');
        $this->assertSame('Eastshan office', $record->title);
    }
}
