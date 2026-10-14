<?php

namespace App\Policies;

use App\Enums\AdminPermission;
use App\Models\Township;
use App\Models\User;
use App\Policies\Concerns\ChecksAdminPermission;

class TownshipPolicy
{
    use ChecksAdminPermission;

    public function viewAny(User $user): bool
    {
        return $this->allows($user, AdminPermission::ManageTownships);
    }

    public function view(User $user, Township $township): bool
    {
        return $this->allows($user, AdminPermission::ManageTownships);
    }

    public function create(User $user): bool
    {
        return $this->allows($user, AdminPermission::ManageTownships);
    }

    public function update(User $user, Township $township): bool
    {
        return $this->allows($user, AdminPermission::ManageTownships);
    }

    public function delete(User $user, Township $township): bool
    {
        return $this->allows($user, AdminPermission::ManageTownships);
    }

    public function deleteAny(User $user): bool
    {
        return $this->allows($user, AdminPermission::ManageTownships);
    }
}
