#!/bin/bash

set -o errexit -o nounset

# config
git config user.email "nobody@nobody.org"
git config user.name "Travis CI"

# set the remote

git remote add upstream "https://$GITHUB_TOKEN@github.com/open-curriculum/oerschema.git"

# update the dist folder
git checkout upstream/gh-pages
git pull -m "Pulling most recent"