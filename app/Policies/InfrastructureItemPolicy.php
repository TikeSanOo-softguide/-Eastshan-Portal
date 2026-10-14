<?php

namespace App\Policies;

use App\Enums\AdminPermission;
use App\Models\InfrastructureItem;
use App\Models\User;
use App\Policies\Concerns\ChecksAdminPermission;

class InfrastructureItemPolicy
{
    use ChecksAdminPermission;

    public function viewAny(User $user): bool
    {
        return $this->allows($user, AdminPermission::ManageInfrastructure);
    }

    public function view(User $user, InfrastructureItem $infrastructureItem): bool
    {
        return $this->allows($user, AdminPermission::ManageInfrastructure);
    }

    public function create(User $user): bool
    {
        return $this->allows($user, AdminPermission::ManageInfrastructure);
    }

    public function update(User $user, InfrastructureItem $infrastructureItem): bool
    {
        return $this->allows($user, AdminPermission::ManageInfrastructure);
    }

    public function delete(User $user, InfrastructureItem $infrastructureItem): bool
    {
        return $this->allows($user, AdminPermission::ManageInfrastructure);
    }

    public function deleteAny(User $user): bool
    {
        return $this->allows($user, AdminPermission::ManageInfrastructure);
    }
}
