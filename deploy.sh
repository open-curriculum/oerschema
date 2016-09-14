#!/bin/sh

# config
git config --global user.email "nobody@nobody.org"
git config --global user.name "Travis CI"

git add dist
git commit -m "Auto push from Travis"
git subtree push --prefix dist origin gh-pages