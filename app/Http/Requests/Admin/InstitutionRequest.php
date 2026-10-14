<?php

namespace App\Http\Requests\Admin;

use App\Enums\AdminPermission;
use App\Enums\InstitutionType;
use App\Support\TranslatableInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InstitutionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can(AdminPermission::ManageInstitutions->value) === true;
    }

    public function rules(): array
    {
        $institution = $this->route('institution');
        $institutionId = is_object($institution) ? $institution->id : $institution;

        return [
            ...TranslatableInput::rules('name', true, 'string|max:255'),
            ...TranslatableInput::rules('description', false, 'string|max:5000'),
            'type' => ['required', Rule::enum(InstitutionType::class)],
            'slug' => [
                'required',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique('institutions', 'slug')->ignore($institutionId),
            ],
            'parent_id' => ['nullable', 'integer', 'exists:institutions,id'],
            'address' => ['nullable', 'string', 'max:500'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'logo' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,gif', 'max:4096'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
