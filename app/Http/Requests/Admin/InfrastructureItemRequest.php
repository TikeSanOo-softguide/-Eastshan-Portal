<?php

namespace App\Http\Requests\Admin;

use App\Enums\AdminPermission;
use App\Enums\InfrastructureCategory;
use App\Enums\InfrastructureStatus;
use App\Support\TranslatableInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InfrastructureItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can(AdminPermission::ManageInfrastructure->value) === true;
    }

    public function rules(): array
    {
        return [
            ...TranslatableInput::rules('name', true, 'string|max:255'),
            'township_id' => ['required', 'integer', 'exists:townships,id'],
            'category' => ['required', Rule::enum(InfrastructureCategory::class)],
            'status' => ['required', Rule::enum(InfrastructureStatus::class)],
            'stats' => ['nullable', 'array'],
            'year' => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ];
    }
}
