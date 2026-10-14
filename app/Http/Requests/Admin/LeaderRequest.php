<?php

namespace App\Http\Requests\Admin;

use App\Enums\AdminPermission;
use App\Support\TranslatableInput;
use Illuminate\Foundation\Http\FormRequest;

class LeaderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can(AdminPermission::ManageLeaders->value) === true;
    }

    public function rules(): array
    {
        return [
            ...TranslatableInput::rules('name', true, 'string|max:255'),
            ...TranslatableInput::rules('position', true, 'string|max:255'),
            ...TranslatableInput::rules('bio', false, 'string|max:5000'),
            'institution_id' => ['required', 'integer', 'exists:institutions,id'],
            'photo' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,gif', 'max:4096'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ];
    }
}
