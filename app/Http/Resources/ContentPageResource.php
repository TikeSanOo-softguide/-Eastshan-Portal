<?php

namespace App\Http\Resources;

use App\Support\RichText;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\ContentPage */
class ContentPageResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        [$html, $toc] = $this->bodyWithToc(RichText::toSafeHtml($this->body));

        return [
            'id' => $this->id,
            'section' => $this->section->value,
            'slug' => $this->slug,
            'title' => $this->title,
            'body_html' => $html,
            'excerpt' => RichText::toPlainExcerpt($this->body),
            'cover' => $this->cover ? '/'.$this->cover : null,
            'toc' => $toc,
            'sort_order' => $this->sort_order,
        ];
    }

    /**
     * @return array{0: string, 1: list<array{id: string, label: string}>}
     */
    private function bodyWithToc(string $html): array
    {
        if ($html === '') {
            return ['', []];
        }

        $toc = [];
        $index = 0;

        $withIds = preg_replace_callback(
            '/<h([2-3])([^>]*)>(.*?)<\/h\1>/is',
            function (array $match) use (&$toc, &$index) {
                $index++;
                $id = 'section-'.$index;
                $label = trim(html_entity_decode(strip_tags($match[3])));

                if ($label !== '') {
                    $toc[] = ['id' => $id, 'label' => $label];
                }

                $attrs = $match[2];

                if (! preg_match('/\sid=/i', $attrs)) {
                    $attrs .= ' id="'.$id.'"';
                }

                return '<h'.$match[1].$attrs.'>'.$match[3].'</h'.$match[1].'>';
            },
            $html
        ) ?? $html;

        if ($toc === []) {
            $withIds = '<div id="overview">'.$withIds.'</div>';
            $toc[] = [
                'id' => 'overview',
                'label' => RichText::toPlainExcerpt($this->title ?: $this->body, 60) ?: 'Overview',
            ];
        }

        return [$withIds, $toc];
    }
}
