#!/usr/bin/env bash
read -p "Enter new version number: " version
git fetch -p
echo "Preparing DEV branch..."
git checkout dev
git pull
sed -i '' -e "/version/s/: \".*\"/: \"${version}\"/" package.json
git commit -a -m "Prepare for v${version}"
git push
echo "Preparing MASTER branch..."
git checkout master
git pull
git merge dev -m "Release v${version}"
git push
