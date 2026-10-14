<?php

namespace App\Policies;

use App\Enums\AdminPermission;
use App\Models\Article;
use App\Models\User;
use App\Policies\Concerns\ChecksAdminPermission;

class ArticlePolicy
{
    use ChecksAdminPermission;

    public function viewAny(User $user): bool
    {
        return $this->allows($user, AdminPermission::ManageArticles);
    }

    public function view(User $user, Article $article): bool
    {
        return $this->allows($user, AdminPermission::ManageArticles);
    }

    public function create(User $user): bool
    {
        return $this->allows($user, AdminPermission::ManageArticles);
    }

    public function update(User $user, Article $article): bool
    {
        return $this->allows($user, AdminPermission::ManageArticles);
    }

    public function delete(User $user, Article $article): bool
    {
        return $this->allows($user, AdminPermission::ManageArticles);
    }

    public function deleteAny(User $user): bool
    {
        return $this->allows($user, AdminPermission::ManageArticles);
    }
}
