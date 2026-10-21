FROM php:8.3.36-cli


# extensions nécessaires Laravel
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    zip \
    && docker-php-ext-install pdo pdo_mysql zip


# composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer


WORKDIR /var/www
