#!/bin/sh

set -o errexit -o nounset

git config --global user.email "nobody@nobody.org"
git config --global user.name "Travis CI"

git clone "https://$GITHUB_TOKEN@github.com/open-curriculum/oerschema.git" -b gh-pages _dist

# Run Gulp
gulp
cd _dist/
ls | grep -v .git | xargs rm -R #clean the directory to remove no longer used files
cp -R ../dist/* . # copy over the new, correct build
ls -l

# Add, Commit and Push
git add --all
git commit -m "Auto push from Travis"
git push --force