<?php

namespace Database\Seeders;

use App\Enums\ArticleCategory;
use App\Enums\CategoryType;
use App\Enums\ContentSection;
use App\Enums\InfrastructureCategory;
use App\Enums\InfrastructureStatus;
use App\Enums\InstitutionType;
use App\Enums\PublicationStatus;
use App\Models\Article;
use App\Models\Category;
use App\Models\ContentPage;
use App\Models\InfrastructureItem;
use App\Models\Institution;
use App\Models\Leader;
use App\Models\Media;
use App\Models\NewsItem;
use App\Models\Township;
use App\Models\User;
use Illuminate\Database\Seeder;

class SampleContentSeeder extends Seeder
{
    public function run(): void
    {
        $editor = User::query()->where('email', 'editor@example.com')->firstOrFail();
        $admin = User::query()->where('email', 'admin@example.com')->firstOrFail();

        $institutions = $this->seedInstitutions();
        $departments = $this->seedDepartments($institutions);
        $this->seedLeaders([...$institutions, ...$departments]);
        $townships = $this->seedTownships();
        $this->seedInfrastructure($townships);
        $this->seedContentPages();
        $newsCategories = $this->seedCategories();
        $this->seedNews($newsCategories);
        $this->seedArticles($editor, $admin);
        $this->seedMedia($admin, $institutions);
    }

    /**
     * @param  list<Institution>  $institutions
     */
    private function seedLeaders(array $institutions): void
    {
        $roles = [
            [
                'en' => 'Sample chair',
                'my' => 'နမူနာ ဥက္ကဋ္ဌ',
                'zh' => '示例主席',
            ],
            [
                'en' => 'Sample secretary',
                'my' => 'နမူနာ အတွင်းရေးမှူး',
                'zh' => '示例秘书',
            ],
            [
                'en' => 'Sample member',
                'my' => 'နမူနာ အဖွဲ့ဝင်',
                'zh' => '示例成员',
            ],
        ];

        $number = 0;

        foreach ($institutions as $institution) {
            foreach ($roles as $index => $position) {
                $number++;
                $photoNumber = (($number - 1) % 12) + 1;

                Leader::query()->create([
                    'institution_id' => $institution->id,
                    'name' => $this->text(
                        "Sample Leader {$number}",
                        "နမူနာ ခေါင်းဆောင် {$number}",
                        "示例负责人 {$number}",
                    ),
                    'position' => $position,
                    'bio' => $this->text(
                        'Sample biography for layout preview. This person is fictional, and the text is not about anyone real.',
                        'ပုံစံစမ်းဖို့ ရေးထားတဲ့ နမူနာ ကိုယ်ရေးအကျဉ်းဖြစ်ပါတယ်။ ဒီပုဂ္ဂိုလ်ဟာ တကယ့်လူမဟုတ်သလို၊ ဘယ်သူ့အကြောင်းမှ ပြောထားတာမဟုတ်ပါ။',
                        '这是用于版式预览的示例简介。人物完全虚构，并非对任何真实人物的记述。',
                    ),
                    'photo' => "samples/leaders/leader-{$photoNumber}.png",
                    'sort_order' => $index + 1,
                ]);
            }
        }
    }

    /**
     * @return list<Institution>
     */
    private function seedInstitutions(): array
    {
        $regions = [
            ['amber-river', 'Amber River', 'ပယင်းမြစ်', '琥珀河', 'Sample Street 1'],
            ['cedar-hills', 'Cedar Hills', 'အာရဇ်တောင်ကုန်း', '雪松山', 'Sample Street 2'],
            ['lantern-valley', 'Lantern Valley', 'မီးအိမ်ချိုင့်', '灯笼谷', 'Sample Street 3'],
            ['silver-pine', 'Silver Pine', 'ငွေထင်းရှူး', '银松', 'Sample Street 4'],
        ];

        $institutions = [];

        foreach ($regions as $index => [$slug, $en, $my, $zh, $street]) {
            $institutions[] = Institution::query()->create([
                'parent_id' => null,
                'type' => InstitutionType::SpecialRegion,
                'name' => $this->text(
                    "{$en} Special Region (sample)",
                    "{$my} အထူးဒေသ (နမူနာ)",
                    "{$zh}特区（示例）",
                ),
                'description' => $this->text(
                    "Placeholder description for the fictional {$en} institution. Invented for the portal sample, not an official profile.",
                    "စိတ်ကူးယဉ် {$my} ဌာနအတွက် နမူနာ ဖော်ပြချက်ဖြစ်ပါတယ်။ ပေါ်တယ်စမ်းသပ်ဖို့ ရေးထားတာဖြစ်ပြီး တရားဝင်မှတ်တမ်းမဟုတ်ပါ။",
                    "虚构的{$zh}机构示例简介，只为门户演示，不是正式介绍。",
                ),
                'slug' => $slug,
                'address' => $street.', Sample Town',
                'phone' => '090000000'.($index + 1),
                'email' => "{$slug}@example.com",
                'logo' => "samples/institutions/{$slug}.png",
                'sort_order' => $index + 1,
                'is_active' => true,
            ]);
        }

        return $institutions;
    }

    /**
     * @param  list<Institution>  $parents
     * @return list<Institution>
     */
    private function seedDepartments(array $parents): array
    {
        $departments = [];

        foreach ($parents as $parent) {
            foreach ([
                ['admin', 'Administration office', 'အုပ်ချုပ်ရေးရုံး', '行政办公室', InstitutionType::Office],
                ['planning', 'Planning department', 'စီမံကိန်းဌာန', '规划部门', InstitutionType::Department],
            ] as $index => [$suffix, $en, $my, $zh, $type]) {
                $departments[] = Institution::query()->create([
                    'parent_id' => $parent->id,
                    'type' => $type,
                    'name' => $this->text(
                        "{$en} ({$parent->slug})",
                        "{$my} ({$parent->slug})",
                        "{$zh}（{$parent->slug}）",
                    ),
                    'description' => $this->text(
                        "Sample {$en} under a fictional parent institution. Placeholder text only.",
                        "စိတ်ကူးယဉ် မိခင်ဌာနအောက်ရှိ နမူနာ {$my} ဖြစ်ပါတယ်။",
                        "虚构上级机构下的示例{$zh}，仅为占位说明。",
                    ),
                    'slug' => $parent->slug.'-'.$suffix,
                    'address' => $parent->address,
                    'phone' => $parent->phone,
                    'email' => $suffix.'@'.$parent->slug.'.example.com',
                    'logo' => null,
                    'sort_order' => $index + 1,
                    'is_active' => true,
                ]);
            }
        }

        return $departments;
    }

    /**
     * @return list<Township>
     */
    private function seedTownships(): array
    {
        $places = [
            ['riverbend', 'Riverbend', 'မြစ်ကွေ့', '河湾'],
            ['cedar-market', 'Cedar Market', 'အာရဇ်ဈေး', '雪松集'],
            ['lantern-ford', 'Lantern Ford', 'မီးအိမ်ဆိပ်', '灯笼渡'],
            ['pine-landing', 'Pine Landing', 'ထင်းရှူးဆိပ်', '松岸'],
            ['amber-fields', 'Amber Fields', 'ပယင်းလယ်', '琥珀田'],
            ['hill-gate', 'Hill Gate', 'တောင်တံခါး', '山门'],
            ['south-orchard', 'South Orchard', 'တောင်ဥယျာဉ်', '南园'],
            ['west-ferry', 'West Ferry', 'အနောက်ဖယ်ရီ', '西渡'],
            ['north-mill', 'North Mill', 'မြောက်စက်ရုံ', '北磨'],
            ['quiet-harbor', 'Quiet Harbor', 'ငြိမ်ဆိပ်ကမ်း', '静港'],
        ];

        $townships = [];

        foreach ($places as $index => [$slug, $en, $my, $zh]) {
            $townships[] = Township::query()->create([
                'name' => $this->text(
                    "Sample {$en}",
                    "နမူနာ {$my}",
                    "示例{$zh}",
                ),
                'slug' => $slug,
                'population' => 12000 + ($index * 2500),
                'area_km2' => 80 + ($index * 18.5),
                'lat' => 21.1 + ($index * 0.08),
                'lng' => 99.2 + ($index * 0.06),
                'sort_order' => $index + 1,
            ]);
        }

        return $townships;
    }

    /**
     * @param  list<Township>  $townships
     */
    private function seedInfrastructure(array $townships): void
    {
        $categories = InfrastructureCategory::cases();
        $statuses = InfrastructureStatus::cases();
        $labels = [
            InfrastructureCategory::Education->value => ['school', 'စာသင်ကျောင်း', '学校'],
            InfrastructureCategory::Health->value => ['clinic', 'ဆေးခန်း', '诊所'],
            InfrastructureCategory::Electricity->value => ['power line', 'ဓာတ်အားလိုင်း', '供电线路'],
            InfrastructureCategory::RoadBridge->value => ['bridge', 'တံတား', '桥梁'],
        ];

        for ($i = 0; $i < 20; $i++) {
            $category = $categories[$i % count($categories)];
            [$en, $my, $zh] = $labels[$category->value];
            $number = $i + 1;

            InfrastructureItem::query()->create([
                'township_id' => $townships[$i % count($townships)]->id,
                'category' => $category,
                'name' => $this->text(
                    "Sample {$en} {$number}",
                    "နမူနာ {$my} {$number}",
                    "示例{$zh} {$number}",
                ),
                'status' => $statuses[$i % count($statuses)],
                'stats' => $this->statsFor($category, $number),
                'year' => 2016 + ($i % 10),
                'sort_order' => $number,
            ]);
        }
    }

    /**
     * @return array<string, int|float>
     */
    private function statsFor(InfrastructureCategory $category, int $number): array
    {
        return match ($category) {
            InfrastructureCategory::Education => ['classrooms' => 6 + ($number % 5), 'teachers' => 10 + $number],
            InfrastructureCategory::Health => ['beds' => 8 + ($number % 6), 'staff' => 6 + ($number % 4)],
            InfrastructureCategory::Electricity => ['households' => 200 + ($number * 15)],
            InfrastructureCategory::RoadBridge => ['length_km' => 1.5 + ($number % 7)],
        };
    }

    private function seedContentPages(): void
    {
        $pages = [
            [ContentSection::History, 'sample-history-overview', 'History overview', 'သမိုင်း အကျဉ်း', '历史概述'],
            [ContentSection::History, 'sample-history-timeline', 'History timeline', 'သမိုင်း အချိန်ဇယား', '历史年表'],
            [ContentSection::SocioEconomy, 'sample-socio-economy', 'Social and economic notes', 'လူမှုစီးပွား မှတ်စု', '社会经济笔记'],
            [ContentSection::Religion, 'sample-religion', 'Beliefs and places of worship', 'ကိုးကွယ်မှုနှင့် ဘုရားကျောင်း', '信仰与礼拜场所'],
            [ContentSection::Heritage, 'sample-heritage', 'Heritage places', 'အမွေအနှစ် နေရာများ', '遗产地'],
            [ContentSection::Customs, 'sample-customs', 'Customs and festivals', 'ဓလေ့နှင့် ပွဲတော်', '习俗与节日'],
        ];

        foreach ($pages as $index => [$section, $slug, $en, $my, $zh]) {
            ContentPage::query()->create([
                'section' => $section,
                'slug' => $slug,
                'title' => $this->text("Sample: {$en}", "နမူနာ — {$my}", "示例：{$zh}"),
                'body' => $this->text(
                    "<h2>Overview</h2><p>Sample page about {$en}. The details are invented for layout preview and should not be read as a real account.</p><h2>Notes</h2><p>This second section exists so the table of contents can be checked. Replace with reviewed copy before launch.</p><script>alert(1)</script>",
                    "<h2>အကျဉ်း</h2><p>{$my} အကြောင်း နမူနာ စာမျက်နှာဖြစ်ပါတယ်။ အချက်အလက်တွေကို ပုံစံစမ်းဖို့ တီထွင်ထားတာဖြစ်လို့ မှတ်တမ်းအဖြစ် မယူပါနဲ့။</p><h2>မှတ်ချက်</h2><p>မာတိကာ စမ်းသပ်ရန် ဒုတိယအပိုင်းဖြစ်ပါတယ်။</p><script>alert(1)</script>",
                    "<h2>概述</h2><p>这是关于{$zh}的示例页面。内容为演示编造，不能当作真实记述。</p><h2>说明</h2><p>第二节用于检查目录。上线前请替换为审定文案。</p><script>alert(1)</script>",
                ),
                'cover' => "samples/pages/{$slug}.png",
                'is_published' => true,
                'sort_order' => $index + 1,
            ]);
        }
    }

    /**
     * @return list<Category>
     */
    private function seedCategories(): array
    {
        $news = [
            ['announcements', 'Announcements', 'ကြေညာချက်', '公告'],
            ['community', 'Community', 'ရပ်ရွာ', '社区'],
            ['services', 'Services', 'ဝန်ဆောင်မှု', '服务'],
        ];
        $articles = [
            ['notes', 'Notes', 'မှတ်စု', '札记'],
            ['stories', 'Stories', 'ပုံပြင်', '故事'],
        ];

        $created = [];

        foreach ($news as $index => [$slug, $en, $my, $zh]) {
            $created[] = $this->makeCategory(CategoryType::News, $slug, $en, $my, $zh, $index + 1);
        }

        foreach ($articles as $index => [$slug, $en, $my, $zh]) {
            $this->makeCategory(CategoryType::Article, $slug, $en, $my, $zh, $index + 1);
        }

        return $created;
    }

    private function makeCategory(CategoryType $type, string $slug, string $en, string $my, string $zh, int $order): Category
    {
        return Category::query()->create([
            'type' => $type,
            'name' => $this->text("Sample {$en}", "နမူနာ {$my}", "示例{$zh}"),
            'slug' => $slug,
            'sort_order' => $order,
        ]);
    }

    /**
     * @param  list<Category>  $categories
     */
    private function seedNews(array $categories): void
    {
        $headlines = [
            ['Market day notice', 'ဈေးနေ့ ကြေညာချက်', '集市日通知'],
            ['Clinic hours change', 'ဆေးခန်းချိန် ပြောင်းလဲမှု', '门诊时间调整'],
            ['School term opens', 'စာသင်နှစ် ဖွင့်လှစ်', '学期开学'],
            ['Bridge repair update', 'တံတားပြင်ဆင်မှု', '桥梁维修进展'],
            ['Power maintenance', 'ဓာတ်အား ပြုပြင်ထိန်းသိမ်းမှု', '电力检修'],
            ['Library sample hour', 'စာကြည့်တိုက် နမူနာချိန်', '图书馆示例开放'],
            ['Ferry schedule draft', 'ဖယ်ရီ အချိန်ဇယား မူကြမ်း', '渡轮时刻草稿'],
            ['Orchard festival poster', 'ဥယျာဉ်ပွဲ ပိုစတာ', '果园节海报'],
            ['Road closure sample', 'လမ်းပိတ် နမူနာ', '道路封闭示例'],
            ['Water point check', 'ရေပိုက်စစ်ဆေးမှု', '取水点检查'],
        ];

        foreach ($headlines as $index => [$en, $my, $zh]) {
            NewsItem::query()->create([
                'category_id' => $categories[$index % count($categories)]->id,
                'title' => $this->text("Sample: {$en}", "နမူနာ — {$my}", "示例：{$zh}"),
                'excerpt' => $this->text(
                    'Sample news excerpt. This item does not describe a real event.',
                    'နမူနာ သတင်းအကျဉ်းဖြစ်ပါတယ်။ တကယ့်ဖြစ်ရပ်ကို ဖော်ပြတာမဟုတ်ပါ။',
                    '示例新闻摘要，并不记述真实事件。',
                ),
                'source_name' => 'Sample Desk',
                'source_url' => 'https://example.com/sample-news/'.($index + 1),
                'published_at' => now()->subDays(20 - $index),
            ]);
        }
    }

    private function seedArticles(User $editor, User $admin): void
    {
        $pieces = [
            [ArticleCategory::Knowledge, 'How a sample map is read', 'နမူနာ မြေပုံဖတ်ပုံ', '怎样看示例地图'],
            [ArticleCategory::Knowledge, 'A note on sample figures', 'နမူနာ ကိန်းဂဏန်း မှတ်စု', '关于示例数字的说明'],
            [ArticleCategory::Knowledge, 'Placeholder field guide', 'နယ်ပယ်လမ်းညွှန် နမူနာ', '示例实地指南'],
            [ArticleCategory::Literary, 'The paper boat', 'စက္ကူလှေ', '纸船'],
            [ArticleCategory::Literary, 'Rain on the sample roof', 'နမူနာ အမိုးပေါ်က မိုး', '示例屋顶上的雨'],
            [ArticleCategory::Literary, 'A short market song', 'ဈေးသီချင်း တိုတို', '一首短集市歌'],
            [ArticleCategory::News, 'Desk notes, week one', 'စာရေးစားပွဲ မှတ်စု၊ ပထမအပတ်', '编辑手记，第一周'],
            [ArticleCategory::News, 'Desk notes, week two', 'စာရေးစားပွဲ မှတ်စု၊ ဒုတိယအပတ်', '编辑手记，第二周'],
            [ArticleCategory::Knowledge, 'Sample glossary entry', 'နမူနာ ဝေါဟာရ', '示例词条'],
            [ArticleCategory::Literary, 'Unpublished draft lantern', 'မထုတ်ရသေးတဲ့ မီးအိမ် မူကြမ်း', '未发布的灯笼草稿'],
        ];

        foreach ($pieces as $index => [$category, $en, $my, $zh]) {
            $published = $index < 9;

            $slug = 'sample-'.str($en)->slug().'-'.($index + 1);

            // Intentionally omit zh on one published article to exercise the "Available in" notice.
            $title = $index === 2
                ? [
                    'en' => "Sample: {$en}",
                    'my' => "နမူနာ — {$my}",
                ]
                : $this->text("Sample: {$en}", "နမူနာ — {$my}", "示例：{$zh}");

            Article::query()->create([
                'author_id' => $index % 2 === 0 ? $editor->id : $admin->id,
                'category' => $category,
                'slug' => $slug,
                'title' => $title,
                'body' => $index === 2
                    ? [
                        'en' => '<h2>Overview</h2><p>Sample article written for the portal preview. It is not journalism, research, or a statement about real people.</p><h2>Notes</h2><p>A second section for reading-time and TOC-style layout checks.</p>',
                        'my' => '<h2>အကျဉ်း</h2><p>ပေါ်တယ် အစမ်းကြည့်ဖို့ ရေးထားတဲ့ နမူနာ ဆောင်းပါးဖြစ်ပါတယ်။ သတင်း၊ သုတေသန၊ သို့မဟုတ် တကယ့်လူတွေအကြောင်း ပြောထားတာမဟုတ်ပါ။</p><h2>မှတ်ချက်</h2><p>ဖတ်ရှုချိန် စမ်းသပ်ရန် ဒုတိယအပိုင်း။</p>',
                    ]
                    : $this->text(
                        '<h2>Overview</h2><p>Sample article written for the portal preview. It is not journalism, research, or a statement about real people.</p><h2>Notes</h2><p>A second section for reading-time and related-article layout checks.</p>',
                        '<h2>အကျဉ်း</h2><p>ပေါ်တယ် အစမ်းကြည့်ဖို့ ရေးထားတဲ့ နမူနာ ဆောင်းပါးဖြစ်ပါတယ်။ သတင်း၊ သုတေသန၊ သို့မဟုတ် တကယ့်လူတွေအကြောင်း ပြောထားတာမဟုတ်ပါ။</p><h2>မှတ်ချက်</h2><p>ဖတ်ရှုချိန်နှင့် ဆက်စပ်ဆောင်းပါး စမ်းသပ်ရန် ဒုတိယအပိုင်း။</p>',
                        '<h2>概述</h2><p>这是为门户预览写的示例文章，不是新闻、研究，也不是对真实人物的陈述。</p><h2>说明</h2><p>第二节用于阅读时长与相关文章版式检查。</p>',
                    ),
                'cover' => $published ? 'samples/articles/article-'.($index + 1).'.png' : null,
                'status' => $published ? PublicationStatus::Published : PublicationStatus::Draft,
                'published_at' => $published ? now()->subDays(15 - $index) : null,
            ]);
        }
    }

    /**
     * @param  list<Institution>  $institutions
     */
    private function seedMedia(User $admin, array $institutions): void
    {
        foreach ($institutions as $index => $institution) {
            Media::query()->create([
                'user_id' => $admin->id,
                'mediable_type' => $institution->getMorphClass(),
                'mediable_id' => $institution->id,
                'disk' => 'public',
                'path' => $institution->logo,
                'file_name' => basename((string) $institution->logo),
                'mime_type' => 'image/png',
                'size' => 24000 + ($index * 1000),
                'alt' => $this->text(
                    'Sample logo placeholder',
                    'နမူနာ လိုဂို နေရာလွတ်',
                    '示例标志占位图',
                ),
                'sort_order' => $index + 1,
            ]);
        }
    }

    /**
     * @return array{en: string, my: string, zh: string}
     */
    private function text(string $en, string $my, string $zh): array
    {
        return [
            'en' => $en,
            'my' => $my,
            'zh' => $zh,
        ];
    }
}
