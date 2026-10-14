<?php

namespace App\Http\Controllers;

use App\Enums\ContentSection;
use App\Http\Resources\ContentPageResource;
use App\Http\Resources\ContentPageSummaryResource;
use App\Models\ContentPage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class AboutController extends Controller
{
    public function show(Request $request, string $locale, ?string $section = null): Response
    {
        $sectionKey = $section ?? $request->route('section');
        $contentSection = $this->resolveSection($sectionKey);

        if (! $contentSection) {
            throw new NotFoundHttpException;
        }

        $slug = $request->string('page')->toString();

        $pages = ContentPage::query()
            ->published()
            ->where('section', $contentSection)
            ->ordered()
            ->get();

        if ($pages->isEmpty()) {
            return Inertia::render('Public/About/Show', [
                'section' => $contentSection->value,
                'page' => null,
                'related' => [],
            ]);
        }

        $page = $slug !== ''
            ? $pages->firstWhere('slug', $slug)
            : $pages->first();

        if (! $page) {
            throw new NotFoundHttpException;
        }

        $related = $pages
            ->where('id', '!=', $page->id)
            ->values();

        return Inertia::render('Public/About/Show', [
            'section' => $contentSection->value,
            'page' => (new ContentPageResource($page))->resolve(),
            'related' => ContentPageSummaryResource::collection($related)->resolve(),
            'siblings' => ContentPageSummaryResource::collection($pages)->resolve(),
        ]);
    }

    private function resolveSection(?string $section): ?ContentSection
    {
        return match ($section) {
            'history' => ContentSection::History,
            'socio-economy', 'socio_economy' => ContentSection::SocioEconomy,
            'religion' => ContentSection::Religion,
            'heritage' => ContentSection::Heritage,
            'customs' => ContentSection::Customs,
            default => ContentSection::tryFrom((string) $section),
        };
    }
}
