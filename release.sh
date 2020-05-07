#!/usr/bin/env bash
read -p "Enter new version number: " version
sed -i '' -e "/version/s/: \".*\"/: \"${version}\"/" package.json
git fetch -p
echo "Preparing MASTER branch..."
git checkout master
git pull
git merge dev -m "Release v${version}"
git push
