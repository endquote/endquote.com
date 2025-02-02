# Find both markdown links and bare URLs
grep -rhoP '\[([^\]]*)\]\((https?://[^\)\"]+)\)|(?<![\(\[])(https?://[^\s\)\"]+)' ../content | \
  sed -E 's/\[.*\]\((.*)\)/\1/g' | \
  sort -u | \
  while read url; do 
    wget --spider \
      --timeout=10 \
      --tries=2 \
      --no-check-certificate \
      --max-redirect=5 \
      -q "$url" 
    if [ $? -ne 0 ]; then
      echo $url
    fi
done
