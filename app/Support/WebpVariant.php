<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class WebpVariant
{
    public static function writeSibling(string $relativePath, string $disk = 'public'): ?string
    {
        if (! function_exists('imagewebp') || ! Storage::disk($disk)->exists($relativePath)) {
            return null;
        }

        $absolute = Storage::disk($disk)->path($relativePath);
        $mime = mime_content_type($absolute) ?: '';
        $image = match ($mime) {
            'image/jpeg' => @imagecreatefromjpeg($absolute),
            'image/png' => @imagecreatefrompng($absolute),
            default => false,
        };

        if ($image === false || $image === null) {
            return null;
        }

        $webpRelative = preg_replace('/\.(jpe?g|png)$/i', '.webp', $relativePath);

        if (! is_string($webpRelative) || $webpRelative === $relativePath) {
            imagedestroy($image);

            return null;
        }

        imagewebp($image, Storage::disk($disk)->path($webpRelative), 82);
        imagedestroy($image);

        return $webpRelative;
    }

    /**
     * Public URL for a generated WebP sibling, when that file exists.
     */
    public static function siblingUrl(?string $path): ?string
    {
        if (! $path || Str::startsWith($path, ['http://', 'https://'])) {
            return null;
        }

        $relative = ltrim($path, '/');
        $webp = preg_replace('/\.(jpe?g|png)$/i', '.webp', $relative);

        if (! is_string($webp) || $webp === $relative) {
            return null;
        }

        if (Str::startsWith($relative, 'uploads/') && Storage::disk('public')->exists($webp)) {
            return '/storage/'.$webp;
        }

        if (is_file(public_path($webp))) {
            return '/'.$webp;
        }

        return null;
    }
}
