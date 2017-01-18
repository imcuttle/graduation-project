#!/bin/bash

msg="from bash"
if [ -n "$1" ]; then
    msg=$1
fi

(cd gp-njnu-photos-app && npm run build)

git add .
git commit -m "$1"
git push
