# Eastshan Portal

Laravel 11 + Inertia React (Breeze) portal scaffold with roles/permissions, translations, and Docker-ready deployment.

## Tech stack

- **Backend:** Laravel 11, PHP 8.2+ (8.4 recommended), SQLite (local) / MySQL (Docker)
- **Auth UI:** Laravel Breeze (Inertia + React, JSX)
- **Frontend:** React 18, Vite 6, Tailwind CSS, Framer Motion, Lucide React
- **i18n:** i18next / react-i18next (`en`, `my` stubs)
- **Packages:** `spatie/laravel-permission`, `spatie/laravel-translatable`

## Requirements

- PHP 8.2+ with extensions: mbstring, xml, curl, zip, sqlite3, mysql, gd, bcmath, intl
- Composer 2
- Node.js 20 LTS + npm

## Local setup

```bash
cp .env.example .env
composer install
php artisan key:generate
touch database/database.sqlite   # if using SQLite
php artisan migrate --seed
npm install
npm run build                    # or: npm run dev
php artisan serve
```

App URL: http://127.0.0.1:8000

### Environment

Copy `.env.example` to `.env` and adjust:

- `APP_URL` — public URL
- `DB_CONNECTION=sqlite` for local, or MySQL vars for Docker/production
- `APP_KEY` — generated via `php artisan key:generate`

## Make targets

```bash
make install   # composer + npm + key + migrate
make dev       # Vite + artisan serve (concurrently if available)
make serve     # php artisan serve
make build     # npm run build
make format    # Pint + Prettier (if installed)
make test      # php artisan test
make up        # docker compose up -d
make down      # docker compose down
```

## Docker

```bash
cp .env.example .env
# set DB_CONNECTION=mysql and DB_* to match docker-compose (host: mysql)
docker compose up -d --build
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate --seed
```

Services: `app` (PHP-FPM), `nginx`, `mysql`, optional `vite` (Node) for HMR.

## Project layout (frontend)

```
resources/js/
  Components/          # Breeze components + ui/ public/ admin/
  Layouts/             # Breeze layouts
  Pages/               # Breeze Auth + Dashboard; Public/ Admin/ reserved
  lib/i18n.js          # i18next bootstrap
  locales/en.json
  locales/my.json
```

Breeze auth pages stay under `Pages/Auth`. Do not move them unless intentionally refactoring routes.

## Common commands

```bash
php artisan migrate
php artisan db:seed
php artisan serve
npm run dev
npm run build
./vendor/bin/pint
php artisan test
```

## Media placeholders

The public home page expects looping clips and posters under `public/videos/`:

- `hero.mp4` + `hero.jpg`
- `card-1.mp4` … `card-6.mp4` with matching `card-1.jpg` … `card-6.jpg`
- `leader-placeholder.jpg` (fallback when a leader photo is missing)

These files are **tiny placeholders** generated for layout and performance work. Replace them with licensed stock footage and real posters before launch. Leadership photos referenced by the seeder live under `public/samples/leaders/` and are also placeholders.

### Hero video

Keep the homepage hero under **4 MB**:

- H.264 MP4 (`hero.mp4`) for broad playback
- WebM (`hero.webm`) as a smaller alternate when you have it
- Poster image `hero.jpg` (or `.webp`) so the first frame shows before the clip loads

```bash
ffmpeg -i source.mp4 -c:v libx264 -crf 28 -preset slow -an -movflags +faststart -vf "scale=1280:-2" public/videos/hero.mp4
ffmpeg -i source.mp4 -c:v libvpx-vp9 -crf 34 -b:v 0 -an -vf "scale=1280:-2" public/videos/hero.webm
```

Uploaded JPEG/PNG covers are stored as-is and a WebP sibling is written when PHP GD supports `imagewebp`. Article cards prefer that WebP when the file exists.

## Production VPS (Nginx, PHP-FPM, MySQL, SSL)

1. **Server packages:** Nginx, PHP 8.2+ FPM (`mbstring`, `xml`, `curl`, `zip`, `mysql`, `gd`, `bcmath`, `intl`), MySQL 8, Composer, Node 20 (build only), Certbot.
2. **App directory:** `/var/www/eastshan`. Clone the repo, `composer install --no-dev --optimize-autoloader`, `npm ci && npm run build`.
3. **Environment:** copy `.env.example` to `.env`. Set `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL=https://your-domain`, `APP_KEY` via `php artisan key:generate`. Use MySQL (`DB_CONNECTION=mysql`). Set `SESSION_SECURE_COOKIE=true`. For locale cache tags set `CACHE_STORE=redis` (Redis) or `memcached`. `QUEUE_CONNECTION=database` is enough to start; switch to Redis if the queue grows.
4. **Database:** `php artisan migrate --force --seed` only on a first demo install. Do not re-seed production content.
5. **Storage:** `php artisan storage:link`. Nginx must serve `public/` as the web root, not the project root.
6. **Nginx site** (`/etc/nginx/sites-available/eastshan`):

```nginx
server {
    listen 80;
    server_name your-domain;
    root /var/www/eastshan/public;
    index index.php;
    client_max_body_size 8M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
    }

    location ~* \.(css|js|webp|jpg|jpeg|png|gif|svg|woff2|mp4|webm)$ {
        expires 7d;
        access_log off;
    }
}
```

7. **SSL:** `certbot --nginx -d your-domain`. Confirm HTTPS redirects and `SESSION_SECURE_COOKIE=true`.
8. **Queue:** `php artisan queue:work --sleep=3 --tries=3` under systemd (user `www-data`, working directory `/var/www/eastshan`).
9. **Cron:** `* * * * * cd /var/www/eastshan && php artisan schedule:run >> /dev/null 2>&1`
10. **Permissions:** `storage` and `bootstrap/cache` writable by `www-data`. After deploy: `php artisan config:cache && php artisan route:cache && php artisan view:cache`.

## Replace before launch

- `public/videos/*` hero and card clips, plus posters
- `public/samples/**` seeded images (institutions, leaders, articles, pages)
- Seeded copy in `database/seeders/SampleContentSeeder.php` (sample offices, news excerpts, articles)
- Accounts `admin@example.com` and `editor@example.com` (password `password`)
- Footer contact placeholders in `resources/js/locales/{en,my,zh}.json`
- Any string still marked sample / နမူနာ / 示例
