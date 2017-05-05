#! /bin/sh
npm version '1.0.0-dev.'$(date +%Y%m%d%H%M)
gulp
npm publish --tag dev ./dist
git push
