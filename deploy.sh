#!/bin/sh

set -o errexit -o nounset

git config --global user.email "nobody@nobody.org"
git config --global user.name "Travis CI"

git clone "https://$GITHUB_TOKEN@github.com/open-curriculum/oerschema.git" -b gh-pages _dist

# Run Gulp
echo "Running Gulp Tasks";
yarn run post-install
echo "Tasks Complete";
cd _dist
echo "In compiled _dist directory, cleaning up data";
find . -maxdepth 1 -regextype posix-extended -not -iregex '^(\.+$|\.\/(assets|CNAME|\..*).*)' -exec rm -R {} \; 2>&1 #clean the directory to remove no longer used files
yes | cp -R ../dist/* . # copy over the new, correct build
echo "Data is clean, committing updates to gh_pages"

# Add, Commit and Push
git add --all -v
sleep 5; # Pause for 5 seconds and let git catchup
git commit -m "Auto push from Travis #$TRAVIS_BUILD_NUMBER"
status=$(git status | head -n2 | tail -n1);

echo $status;

if [ "$status" !=  "Your branch is up-to-date with 'origin/gh-pages'." ]; then
    git push --force
else
    echo "Nothing to commit #$TRAVIS_BUILD_NUMBER";
fi
