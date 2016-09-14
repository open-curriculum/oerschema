#!/bin/sh

set -o errexit -o nounset

# config
git config user.email "nobody@nobody.org"
git config user.name "Travis CI"

# set the remote

git remote add upstream "https://$GITHUB_TOKEN@github.com/open-curriculum/oerschema.git"

# Add, Commit and Push

git add dist
git commit -m "Auto push from Travis"
git push upstream `git subtree split --prefix dist master`:gh-pages --force