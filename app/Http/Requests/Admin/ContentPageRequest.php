<?php

namespace App\Http\Requests\Admin;

use App\Enums\AdminPermission;
use App\Enums\ContentSection;
use App\Support\TranslatableInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ContentPageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can(AdminPermission::ManageContentPages->value) === true;
    }

    public function rules(): array
    {
        $page = $this->route('content_page');
        $id = is_object($page) ? $page->id : $page;

        return [
            ...TranslatableInput::rules('title', true, 'string|max:255'),
            ...TranslatableInput::rules('body', false, 'string|max:50000'),
            'section' => ['required', Rule::enum(ContentSection::class)],
            'slug' => [
                'required',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique('content_pages', 'slug')->ignore($id),
            ],
            'cover' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,gif', 'max:4096'],
            'is_published' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ];
    }
}
