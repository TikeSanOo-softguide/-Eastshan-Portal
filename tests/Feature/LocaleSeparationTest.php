<?php

namespace Tests\Feature;

use Tests\TestCase;

class LocaleSeparationTest extends TestCase
{
    public function test_admin_and_public_locales_stay_independent(): void
    {
        $this->get('/zh');

        $this->get('/mongla/admin')->assertRedirect('/login');

        $this->get('/')->assertRedirect('/zh');
        $this->get('/admin')->assertRedirect('/mongla/admin');
    }
}
