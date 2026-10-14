<?php

namespace App\Support;

class TranslatableInput
{
    /**
     * @param  array<string, mixed>  $payload
     * @param  list<string>  $locales
     * @return array<string, string>
     */
    public static function from(array $payload, array $locales = ['en', 'my', 'zh']): array
    {
        $out = [];

        foreach ($locales as $locale) {
            if (! array_key_exists($locale, $payload)) {
                continue;
            }

            $value = $payload[$locale];

            if (is_string($value) && trim($value) !== '') {
                $out[$locale] = $value;
            }
        }

        return $out;
    }

    /**
     * Validation rules for a translatable field object.
     *
     * @return array<string, list<string>>
     */
    public static function rules(string $field, bool $required = true, string $rule = 'string|max:255'): array
    {
        $parts = explode('|', $rule);
        $rules = [
            $field => [$required ? 'required' : 'nullable', 'array'],
        ];

        foreach (['en', 'my', 'zh'] as $locale) {
            $localeRules = $required && $locale === 'en'
                ? ['required', ...$parts]
                : ['nullable', ...$parts];
            $rules["{$field}.{$locale}"] = $localeRules;
        }

        return $rules;
    }
}
