#!/usr/bin/env bash
sed -i -e "s/href=\".\/\"/href=\"\/\"/g" dist/index.html
rm dist/index.html-e
