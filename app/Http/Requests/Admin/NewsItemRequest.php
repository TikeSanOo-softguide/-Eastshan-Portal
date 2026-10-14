<?php

namespace App\Http\Requests\Admin;

use App\Enums\AdminPermission;
use App\Enums\CategoryType;
use App\Support\TranslatableInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NewsItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can(AdminPermission::ManageNews->value) === true;
    }

    public function rules(): array
    {
        return [
            ...TranslatableInput::rules('title', true, 'string|max:255'),
            ...TranslatableInput::rules('excerpt', true, 'string|max:1000'),
            'category_id' => [
                'required',
                'integer',
                Rule::exists('categories', 'id')->where('type', CategoryType::News->value),
            ],
            'source_name' => ['required', 'string', 'max:255'],
            'source_url' => ['required', 'url', 'max:500'],
            'is_published' => ['sometimes', 'boolean'],
            'published_at' => ['nullable', 'date'],
        ];
    }
}
