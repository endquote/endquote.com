#!/bin/bash
for f in $*
do
  echo "Processing $f file..."
  dirname=$(dirname -- "$f")
  filename=$(basename -- "$f")
  extension="${filename##*.}"
  filename="${filename%.*}"
  ./hls.sh $f "${dirname}/hls/${filename}"
done
