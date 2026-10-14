<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;

class TranslationAvailability
{
    /**
     * @param  list<string>  $fields
     * @return list<string>
     */
    public static function localesFor(Model $model, array $fields = ['title']): array
    {
        $supported = config('locales.supported', ['en', 'my', 'zh']);
        $available = [];

        foreach ($supported as $locale) {
            foreach ($fields as $field) {
                if (! method_exists($model, 'getTranslation')) {
                    continue 2;
                }

                $value = $model->getTranslation($field, $locale, false);

                if (is_string($value) && trim($value) !== '') {
                    $available[] = $locale;

                    continue 2;
                }
            }
        }

        return array_values(array_unique($available));
    }
}
