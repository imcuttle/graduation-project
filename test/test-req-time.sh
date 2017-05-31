#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

[ -n "$1" ] && _file="$1" || _file=tmp.json

echo '[START] clear faces which are already imported.'

args=\{\"hash\":\"*\",\"pwd\":\"$(cat pwd)\",\"stuno\":\"19130126\"}
time curl -s 'https://face.moyuyc.xyz/api/do/face-import/delete' -H 'content-type: application/json;charset=utf-8' -d "$args" --compressed
echo '[END] clear faces which are already imported.'

_base64='data:image/jpeg;base64,'

if [ -f base64.txt ]; then
    _base64=$_base64"$(cat base64.txt)"
else
    _tmp=$(base64 -i face-for-import.jpeg)
    echo $_tmp > base64.txt
    _base64=$_base64"$_tmp"
fi

args=\{\"data\":\""$_base64"\",\"stuno\":\"19130126\",\"stupwd\":\"$(cat pwd)\"\}
echo $args > $_file
echo '[START] import face.'
# https://face.moyuyc.xyz/api/up/face-import/base64
time curl -s 'https://face.moyuyc.xyz/api/up/face-import/base64' -H 'content-type: application/json;charset=utf-8' -d @$_file --compressed
echo '[END] import face.'
/bin/rm $_file

args=\{\"data\":\""$_base64"\",\"cls\":\"191301\"\}
echo $args > $_file
echo '[START] face rec.'
time curl -s 'https://face.moyuyc.xyz/api/up/predict/base64' -H 'content-type: application/json;charset=utf-8' -d @$_file --compressed
echo '[END] face rec.'
/bin/rm $_file


echo '';
