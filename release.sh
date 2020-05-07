#!/usr/bin/env bash
read -p "Enter new version number: " version
git fetch -p
echo "Preparing MASTER branch..."
git checkout master
git pull
git merge dev -m "Prepare for v${version}"
sed -i '' -e "/version/s/: \".*\"/: \"${version}\"/" package.json
git commit -a -m "Release v${version}"
git push
