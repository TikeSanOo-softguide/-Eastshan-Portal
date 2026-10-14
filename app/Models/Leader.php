<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedContent;
use App\Models\Concerns\OrdersBySort;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Leader extends Model
{
    /** @use HasFactory<\Database\Factories\LeaderFactory> */
    use HasFactory, HasLocalizedContent, OrdersBySort;

    public array $translatable = ['name', 'position', 'bio'];

    protected $fillable = [
        'institution_id',
        'name',
        'position',
        'bio',
        'photo',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }
}
