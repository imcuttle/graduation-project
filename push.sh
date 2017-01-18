#!/bin/bash

msg="from bash"
if [ -n "$1" ]; then
    msg=$1
    (cd gp-njnu-photos-app && npm run build)
fi

git add .
git commit -m "$1"
git push

# curl 
