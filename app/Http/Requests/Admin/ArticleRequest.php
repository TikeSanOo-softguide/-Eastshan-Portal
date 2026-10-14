<?php

namespace App\Http\Requests\Admin;

use App\Enums\AdminPermission;
use App\Enums\ArticleCategory;
use App\Enums\PublicationStatus;
use App\Support\TranslatableInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can(AdminPermission::ManageArticles->value) === true;
    }

    public function rules(): array
    {
        $article = $this->route('article');
        $id = is_object($article) ? $article->id : $article;

        return [
            ...TranslatableInput::rules('title', true, 'string|max:255'),
            ...TranslatableInput::rules('body', true, 'string|max:100000'),
            'category' => ['required', Rule::enum(ArticleCategory::class)],
            'slug' => [
                'required',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique('articles', 'slug')->ignore($id),
            ],
            'cover' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,gif', 'max:4096'],
            'status' => ['required', Rule::enum(PublicationStatus::class)],
            'published_at' => ['nullable', 'date'],
            'author_id' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }
}
