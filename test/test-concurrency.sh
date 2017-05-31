#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

#./test-req-time.sh

/bin/rm result-time.txt

for i in $(seq 1 2)
do
    ./test-req-time.sh >> result-time.txt 2>&1
    echo process No"$i" Done.
done & #background

#echo "main"
wait
