#! /bin/sh
npm version '1.0.'$(date +%Y%m%d%H%M)
cnpm run build
npm publish --tag latest ./dist
git push
cnpm sync dask
