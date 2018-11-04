#!/bin/sh

echo "Publishing examples to Github pages...."

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"
yarn publish:examples
