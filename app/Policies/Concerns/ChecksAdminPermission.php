<?php

namespace App\Policies\Concerns;

use App\Enums\AdminPermission;
use App\Enums\UserRole;
use App\Models\User;

trait ChecksAdminPermission
{
    protected function allows(User $user, AdminPermission $permission): bool
    {
        if ($user->hasRole(UserRole::Admin->value)) {
            return true;
        }

        return $user->can($permission->value);
    }
}
