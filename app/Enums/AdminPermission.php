<?php

namespace App\Enums;

enum AdminPermission: string
{
    case ManageInstitutions = 'manage institutions';
    case ManageLeaders = 'manage leaders';
    case ManageTownships = 'manage townships';
    case ManageContentPages = 'manage content pages';
    case ManageInfrastructure = 'manage infrastructure';
    case ManageNews = 'manage news';
    case ManageArticles = 'manage articles';
    case ViewDashboard = 'view dashboard';

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * @return list<string>
     */
    public static function forEditor(): array
    {
        return [
            self::ViewDashboard->value,
            self::ManageNews->value,
            self::ManageArticles->value,
        ];
    }
}
