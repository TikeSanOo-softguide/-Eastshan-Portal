<?php

namespace App\Support;

use Stevebauman\Purify\Facades\Purify;

class RichText
{
    /**
     * Normalize sample/plain text into simple paragraphs, then sanitize HTML.
     */
    public static function toSafeHtml(?string $value): string
    {
        $value = trim((string) $value);

        if ($value === '') {
            return '';
        }

        if (! preg_match('/<[^>]+>/', $value)) {
            $paragraphs = preg_split("/\n{2,}/", $value) ?: [];
            $value = collect($paragraphs)
                ->map(fn (string $paragraph) => '<p>'.e(trim($paragraph)).'</p>')
                ->implode('');
        }

        return Purify::clean($value);
    }

    /**
     * Plain-text excerpt for meta descriptions.
     */
    public static function toPlainExcerpt(?string $value, int $limit = 160): string
    {
        $plain = trim(preg_replace('/\s+/', ' ', strip_tags((string) $value)) ?? '');

        return str($plain)->limit($limit)->toString();
    }
}
