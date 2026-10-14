<?php

return [

    'supported' => ['en', 'my', 'zh'],

    'default' => 'my',

    /*
    | Content translations fall through this list after the active locale.
    | Requested locale -> my -> en.
    */
    'fallback' => ['my', 'en'],

    'cookie' => 'locale',

    /*
    | Admin dashboard lives outside the public locale prefix.
    | http://127.0.0.1:8000/mongla/admin
    */
    'admin_prefix' => 'mongla',

];
