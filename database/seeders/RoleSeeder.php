<?php

namespace Database\Seeders;

use App\Enums\AdminPermission;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        foreach (AdminPermission::values() as $permission) {
            Permission::findOrCreate($permission);
        }

        foreach (UserRole::cases() as $role) {
            Role::findOrCreate($role->value);
        }

        Role::findByName(UserRole::Admin->value)
            ->syncPermissions(AdminPermission::values());

        Role::findByName(UserRole::Editor->value)
            ->syncPermissions(AdminPermission::forEditor());

        $admin = User::query()->firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Sample Admin',
                'password' => 'password',
                'email_verified_at' => now(),
            ],
        );
        $admin->syncRoles([UserRole::Admin->value]);

        $editor = User::query()->firstOrCreate(
            ['email' => 'editor@example.com'],
            [
                'name' => 'Sample Editor',
                'password' => 'password',
                'email_verified_at' => now(),
            ],
        );
        $editor->syncRoles([UserRole::Editor->value]);
    }
}
