<?php

namespace Tests\Feature;

use Tests\TestCase;

class StyleGuideTest extends TestCase
{
    public function test_style_guide_is_hidden_outside_local(): void
    {
        $this->get('/style-guide')->assertNotFound();
        $this->get('/en/style-guide')->assertNotFound();
    }
}
