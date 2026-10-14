<?php

namespace App\Enums;

enum InfrastructureStatus: string
{
    case Operational = 'operational';
    case UnderConstruction = 'under_construction';
    case Planned = 'planned';
}
