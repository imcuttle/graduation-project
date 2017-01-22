#!/bin/bash

msg="from bash"
if [ -n "$1" ]; then
    msg=$1
    (cd gp-njnu-photos-app && npm run build)
fi

git add .
git commit -m "$msg"
git push

if [ $? = 0 ]; then
    curl https://face.moyuyc.xyz/api/ctrl/pull
fi
