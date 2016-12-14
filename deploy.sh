#!/bin/sh

set -o errexit -o nounset

git config --global user.email "nobody@nobody.org"
git config --global user.name "Travis CI"

git clone "https://$GITHUB_TOKEN@github.com/open-curriculum/oerschema.git" -b gh-pages _dist

# Run Gulp
gulp assets
gulp buildSchema
gulp template
cd _dist
find . -maxdepth 1 -regextype posix-extended -not -iregex '^(\.+$|\.\/(assets|CNAME|\..*).*)' -exec rm -R {} \; 2>&1 #clean the directory to remove no longer used files
yes | cp -R ../dist/* . # copy over the new, correct build

# Add, Commit and Push
git add --all
if [ git commit -m "Auto push from Travis" ]; then
    git push --force
else
    echo "Nothing to commit";
fi