#!/bin/bash
yarn
yarn build

cp ./htaccess ./.htaccess
echo "PassengerNodejs $NVM_BIN/node" >> .htaccess

mkdir -p tmp
touch tmp/restart.txt
