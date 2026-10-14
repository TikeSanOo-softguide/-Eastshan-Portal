<?php

namespace App\Policies;

use App\Enums\AdminPermission;
use App\Models\Leader;
use App\Models\User;
use App\Policies\Concerns\ChecksAdminPermission;

class LeaderPolicy
{
    use ChecksAdminPermission;

    public function viewAny(User $user): bool
    {
        return $this->allows($user, AdminPermission::ManageLeaders);
    }

    public function view(User $user, Leader $leader): bool
    {
        return $this->allows($user, AdminPermission::ManageLeaders);
    }

    public function create(User $user): bool
    {
        return $this->allows($user, AdminPermission::ManageLeaders);
    }

    public function update(User $user, Leader $leader): bool
    {
        return $this->allows($user, AdminPermission::ManageLeaders);
    }

    public function delete(User $user, Leader $leader): bool
    {
        return $this->allows($user, AdminPermission::ManageLeaders);
    }

    public function deleteAny(User $user): bool
    {
        return $this->allows($user, AdminPermission::ManageLeaders);
    }
}
