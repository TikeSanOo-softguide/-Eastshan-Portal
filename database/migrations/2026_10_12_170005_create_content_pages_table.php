<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_pages', function (Blueprint $table) {
            $table->id();
            $table->string('section');
            $table->string('slug');
            $table->json('title');
            $table->json('body');
            $table->string('cover')->nullable();
            $table->boolean('is_published')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique('slug');
            $table->index('section');
            $table->index('is_published');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_pages');
    }
};
