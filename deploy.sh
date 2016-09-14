#!/bin/sh

set -o errexit -o nounset

# Get into the dist
cd dist

# Init
git init

# config
git config user.email "nobody@nobody.org"
git config user.name "Travis CI"

# Set Remote
git remote add upstream "https://$GITHUB_TOKEN@github.com/open-curriculum/oerschema.git"

# Add, Commit and Push
git checkout -b gh-pages
git add --all
git commit -m "Auto push from Travis"
git push -u upstream gh-pages --force