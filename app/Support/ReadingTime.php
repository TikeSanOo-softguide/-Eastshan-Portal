<?php

namespace App\Support;

class ReadingTime
{
    public static function minutes(?string $text, int $wordsPerMinute = 200): int
    {
        $plain = trim(preg_replace('/\s+/u', ' ', strip_tags((string) $text)) ?? '');

        if ($plain === '') {
            return 1;
        }

        $words = max(1, count(preg_split('/\s+/u', $plain) ?: []));

        return max(1, (int) ceil($words / $wordsPerMinute));
    }
}
