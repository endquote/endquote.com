# Building Tiles

## First build

```sh
# set up Zoomify script
cd zoomify
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
rm composer-setup.php
php composer.phar require daniel-km/zoomify
```

Modify `vendor/daniel-km/zoomify/src/Zoomify.php`

comment out: Output directory already exists

```sh
brew install imagemagick
brew install pngcrush
```

## Regular builds

Kill Next.js dev server first.

From this folder:

```sh
yarn
yarn build-data
yarn run-data
yarn build-tiles
yarn deploy-tiles
```
