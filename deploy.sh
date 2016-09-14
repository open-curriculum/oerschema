#!/bin/sh

set -o errexit -o nounset

# config
git config user.email "nobody@nobody.org"
git config user.name "Travis CI"

# Add, Commit and Push

git add dist
git commit -m "Auto push from Travis"
git subtree push --prefix dist upstream gh-pages