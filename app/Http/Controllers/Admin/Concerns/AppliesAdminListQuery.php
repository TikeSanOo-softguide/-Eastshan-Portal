<?php

namespace App\Http\Controllers\Admin\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

trait AppliesAdminListQuery
{
    /**
     * @param  list<string>  $searchColumns
     * @param  array<string, string>  $sortable  request key => column
     */
    protected function applyListQuery(
        Builder $query,
        Request $request,
        array $searchColumns,
        array $sortable,
        string $defaultSort = 'id',
        string $defaultDirection = 'desc',
    ): Builder {
        $search = trim($request->string('q')->toString());

        if ($search !== '' && $searchColumns !== []) {
            $locale = app()->getLocale();
            $like = '%'.$search.'%';

            $query->where(function (Builder $builder) use ($searchColumns, $like, $locale) {
                foreach ($searchColumns as $index => $column) {
                    $method = $index === 0 ? 'where' : 'orWhere';

                    if (str_contains($column, '->')) {
                        [$field, $fallback] = explode('->', $column, 2);
                        $builder->{$method}(function (Builder $inner) use ($field, $like, $locale) {
                            $inner->where("{$field}->{$locale}", 'like', $like)
                                ->orWhere("{$field}->en", 'like', $like)
                                ->orWhere("{$field}->my", 'like', $like);
                        });
                    } else {
                        $builder->{$method}($column, 'like', $like);
                    }
                }
            });
        }

        $sort = $request->string('sort')->toString();
        $direction = strtolower($request->string('direction')->toString()) === 'asc' ? 'asc' : 'desc';

        if ($sort !== '' && isset($sortable[$sort])) {
            $query->orderBy($sortable[$sort], $direction);
        } else {
            $query->orderBy($defaultSort, $defaultDirection);
        }

        return $query;
    }
}
