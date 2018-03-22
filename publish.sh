#! /bin/sh
npm version '1.0.'$(date +%Y%m%d%H%M)
gulp
npm publish --tag dev ./dist
git push
cnpm sync dask
