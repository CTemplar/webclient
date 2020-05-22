#!/usr/bin/env bash
read -p "Enter new version number: " version
git fetch -p
git pull --all
echo "Preparing DEV branch..."
git checkout dev
sed -i '' -e "/version/s/: \".*\"/: \"${version}\"/" package.json
git commit -am "Prepare for v${version}"
git push
git checkout -

echo "Preparing MASTER branch..."
git checkout master
git merge dev -m "Release v${version}" -s recursive -X theirs
git push

echo "Preparing GH-PAGES branch..."
npm run build
cp dist/index.html dist/404.html # Trick for GH-Pages
cp docs dist # The images...
sed -e "s/href=\"\/\"/href=\".\/\"/g" dist/index.html > dist/electron-index.html
sed -i '' -e "s/#WEBCLIENT_VERSION#/${version}/" dist/README.md
index_hash=$(openssl dgst -sha256 dist/index.html | awk '{print $NF}')
e_index_hash=$(openssl dgst -sha256 dist/electron-index.html | awk '{print $NF}')
sed -i '' -e "s/#INDEX_HASH#/${index_hash}/" dist/README.md
sed -i '' -e "s/#E_INDEX_HASH#/${e_index_hash}/" dist/README.md
git checkout -
git checkout -B gh-pages
git add -f dist
git commit -am "Release v${version}"
git filter-branch -f --prune-empty --subdirectory-filter dist
git push -f origin gh-pages
git checkout -
