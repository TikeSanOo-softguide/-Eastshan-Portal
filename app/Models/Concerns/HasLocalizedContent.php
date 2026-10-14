<?php

namespace App\Models\Concerns;

use Spatie\Translatable\HasTranslations;

/**
 * JSON translations keyed by en, my, and zh.
 * Missing values fall back through config('locales.fallback'): my, then en.
 */
trait HasLocalizedContent
{
    use HasTranslations;

    protected function normalizeLocale(string $key, string $locale, bool $useFallbackLocale): string
    {
        $translations = $this->getTranslations($key);

        if (! $useFallbackLocale) {
            return $locale;
        }

        $chain = array_values(array_unique([
            $locale,
            ...config('locales.fallback', ['my', 'en']),
        ]));

        foreach ($chain as $candidate) {
            if (! array_key_exists($candidate, $translations)) {
                continue;
            }

            $value = $translations[$candidate];

            if ($value === null || $value === '') {
                continue;
            }

            return $candidate;
        }

        return $locale;
    }
}
