<?php

namespace App\Policies;

use App\Enums\AdminPermission;
use App\Models\Institution;
use App\Models\User;
use App\Policies\Concerns\ChecksAdminPermission;

class InstitutionPolicy
{
    use ChecksAdminPermission;

    public function viewAny(User $user): bool
    {
        return $this->allows($user, AdminPermission::ManageInstitutions);
    }

    public function view(User $user, Institution $institution): bool
    {
        return $this->allows($user, AdminPermission::ManageInstitutions);
    }

    public function create(User $user): bool
    {
        return $this->allows($user, AdminPermission::ManageInstitutions);
    }

    public function update(User $user, Institution $institution): bool
    {
        return $this->allows($user, AdminPermission::ManageInstitutions);
    }

    public function delete(User $user, Institution $institution): bool
    {
        return $this->allows($user, AdminPermission::ManageInstitutions);
    }

    public function deleteAny(User $user): bool
    {
        return $this->allows($user, AdminPermission::ManageInstitutions);
    }
}
