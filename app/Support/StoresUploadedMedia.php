<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

trait StoresUploadedMedia
{
    protected function storePublicUpload(?UploadedFile $file, string $directory, ?string $existing = null): ?string
    {
        if (! $file) {
            return $existing;
        }

        $path = $file->store("uploads/{$directory}", 'public');
        WebpVariant::writeSibling($path);

        if ($existing && Str::startsWith($existing, 'uploads/') && Storage::disk('public')->exists($existing)) {
            Storage::disk('public')->delete($existing);
            $oldWebp = preg_replace('/\.(jpe?g|png)$/i', '.webp', $existing);
            if (is_string($oldWebp) && $oldWebp !== $existing && Storage::disk('public')->exists($oldWebp)) {
                Storage::disk('public')->delete($oldWebp);
            }
        }

        return $path;
    }

    protected function publicMediaUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://', '/'])) {
            return $path;
        }

        if (Str::startsWith($path, 'uploads/')) {
            return '/storage/'.$path;
        }

        return '/'.$path;
    }
}
