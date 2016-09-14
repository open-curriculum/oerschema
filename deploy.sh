#!/bin/sh

set -o errexit -o nounset

git config --global user.email "nobody@nobody.org"
git config --global user.name "Travis CI"

git clone "https://$GITHUB_TOKEN@github.com/open-curriculum/oerschema.git" -b gh-pages _dist

sleep 5 # Let gulp catch up

# Get into the dist
cd _dist
cp -R ../dist/* .

# Add, Commit and Push
git add --all
git commit -m "Auto push from Travis"
git push --force