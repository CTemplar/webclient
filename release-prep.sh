#!/usr/bin/env bash
cd dist
cp index.html 404.html
cp index.html electron-index.html
sed -i -e "s/href=\"\/\"/href=\".\/\"/g" electron-index.html
rm electron-index.html-e
openssl dgst -sha256 *index.html
