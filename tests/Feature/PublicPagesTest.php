<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicPagesTest extends TestCase
{
    public function test_contact_page_accepts_a_sample_message(): void
    {
        $this->get('/en/contact')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Public/Contact/Index'));

        $this->post('/en/contact', [
            'name' => 'Sample Sender',
            'email' => 'sender@example.com',
            'message' => 'Sample note for the preview form.',
        ])->assertRedirect(route('contact.create', ['locale' => 'en']));
    }

    public function test_unknown_public_path_is_not_found(): void
    {
        $this->get('/en/not-a-page')->assertNotFound();
    }
}
