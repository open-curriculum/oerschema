#!/bin/sh

# config
git config --global user.email "nobody@nobody.org"
git config --global user.name "Travis CI"

git subtree push --prefix dist origin gh-pages