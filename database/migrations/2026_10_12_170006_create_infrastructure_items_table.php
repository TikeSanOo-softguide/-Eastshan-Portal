<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('infrastructure_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('township_id')->constrained()->cascadeOnDelete();
            $table->string('category');
            $table->json('name');
            $table->string('status');
            $table->json('stats')->nullable();
            $table->unsignedSmallInteger('year')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index('category');
            $table->index(['township_id', 'category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('infrastructure_items');
    }
};
