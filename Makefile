.PHONY: install dev serve format test build up down

install:
	composer install
	npm install
	@test -f .env || cp .env.example .env
	php artisan key:generate --force
	@mkdir -p database
	@test -f database/database.sqlite || touch database/database.sqlite
	php artisan migrate --force
	npm run build

dev:
	npx concurrently -c "#93c5fd,#c4b5fd" "php artisan serve" "npm run dev" --names=server,vite

serve:
	php artisan serve

format:
	@if [ -x ./vendor/bin/pint ]; then ./vendor/bin/pint; else echo "Pint not found"; fi
	@if command -v npx >/dev/null 2>&1 && [ -f node_modules/.bin/prettier ]; then \
		npx prettier --write "resources/js/**/*.{js,jsx,css,json}"; \
	else \
		echo "Prettier not installed (optional)"; \
	fi

test:
	php artisan test

build:
	npm run build

up:
	@test -f .env || cp .env.example .env
	mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
	chmod -R a+rwx storage bootstrap/cache
	docker compose up -d --build
	docker compose exec -T app sh -c 'grep -q "^APP_KEY=base64:" .env || php artisan key:generate --force'
	docker compose exec -T app php artisan migrate --force
	@count=$$(docker compose exec -T mysql sh -c 'mysql -N -u"$$MYSQL_USER" -p"$$MYSQL_PASSWORD" -e "SELECT COUNT(*) FROM users" "$$MYSQL_DATABASE"' 2>/dev/null | tr -d "[:space:]"); \
	if [ "$$count" = "0" ]; then docker compose exec -T app php artisan db:seed --force; fi
	docker compose exec -T -u root app php artisan storage:link

down:
	docker compose down
