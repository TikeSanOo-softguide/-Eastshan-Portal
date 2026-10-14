<?php

namespace App\Policies;

use App\Enums\AdminPermission;
use App\Models\ContentPage;
use App\Models\User;
use App\Policies\Concerns\ChecksAdminPermission;

class ContentPagePolicy
{
    use ChecksAdminPermission;

    public function viewAny(User $user): bool
    {
        return $this->allows($user, AdminPermission::ManageContentPages);
    }

    public function view(User $user, ContentPage $contentPage): bool
    {
        return $this->allows($user, AdminPermission::ManageContentPages);
    }

    public function create(User $user): bool
    {
        return $this->allows($user, AdminPermission::ManageContentPages);
    }

    public function update(User $user, ContentPage $contentPage): bool
    {
        return $this->allows($user, AdminPermission::ManageContentPages);
    }

    public function delete(User $user, ContentPage $contentPage): bool
    {
        return $this->allows($user, AdminPermission::ManageContentPages);
    }

    public function deleteAny(User $user): bool
    {
        return $this->allows($user, AdminPermission::ManageContentPages);
    }
}
