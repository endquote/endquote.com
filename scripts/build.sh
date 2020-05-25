#!/bin/bash
npm install
npm run build
echo "PassengerNodejs $NVM_BIN/node" > .htaccess
mkdir -p tmp
touch tmp/restart.txt
