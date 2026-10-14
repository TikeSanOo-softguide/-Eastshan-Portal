<?php

namespace App\Policies;

use App\Enums\AdminPermission;
use App\Models\NewsItem;
use App\Models\User;
use App\Policies\Concerns\ChecksAdminPermission;

class NewsItemPolicy
{
    use ChecksAdminPermission;

    public function viewAny(User $user): bool
    {
        return $this->allows($user, AdminPermission::ManageNews);
    }

    public function view(User $user, NewsItem $newsItem): bool
    {
        return $this->allows($user, AdminPermission::ManageNews);
    }

    public function create(User $user): bool
    {
        return $this->allows($user, AdminPermission::ManageNews);
    }

    public function update(User $user, NewsItem $newsItem): bool
    {
        return $this->allows($user, AdminPermission::ManageNews);
    }

    public function delete(User $user, NewsItem $newsItem): bool
    {
        return $this->allows($user, AdminPermission::ManageNews);
    }

    public function deleteAny(User $user): bool
    {
        return $this->allows($user, AdminPermission::ManageNews);
    }
}
