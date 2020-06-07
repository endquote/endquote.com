#!/bin/bash
yarn
yarn build
echo "PassengerNodejs $NVM_BIN/node" > .htaccess
mkdir -p tmp
touch tmp/restart.txt
# trigger build
