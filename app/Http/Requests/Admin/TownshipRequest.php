<?php

namespace App\Http\Requests\Admin;

use App\Enums\AdminPermission;
use App\Support\TranslatableInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TownshipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can(AdminPermission::ManageTownships->value) === true;
    }

    public function rules(): array
    {
        $township = $this->route('township');
        $id = is_object($township) ? $township->id : $township;

        return [
            ...TranslatableInput::rules('name', true, 'string|max:255'),
            'slug' => [
                'required',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique('townships', 'slug')->ignore($id),
            ],
            'population' => ['nullable', 'integer', 'min:0'],
            'area_km2' => ['nullable', 'numeric', 'min:0'],
            'lat' => ['nullable', 'numeric', 'between:-90,90'],
            'lng' => ['nullable', 'numeric', 'between:-180,180'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ];
    }
}
