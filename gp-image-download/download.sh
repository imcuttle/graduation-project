#!/bin/bash

base="http://223.2.10.123/jwgl/photos/rx"
year="2013"

if [ ! -d images ]; then
    echo mkdir images
    mkdir images
fi

cd images

if [ ! -z "$1" ]; then
    year=$1
fi
echo year=$year

if [ ! -d $year ]; then
    echo mkdir $year
    mkdir $year
fi
cd $year



while IFS=$'\r\n' read var; do
    arr+=($var)
done < ../../data/student-ids-$year.txt

assign_file() {
    Name=${1##*/}
    Classno=${Name:0:6}
    if [ ! -d $Classno ]; then
        mkdir $Classno
    fi
    mv $Name "$Classno"/
}

down() {
    URL=$1
    Name=$2
    data=`curl --fail --silent $URL` 
    # echo "$1"
    # "$data" 不能少  因为data中可能包含[]
    if [ ! -z "$data" ]; then
        curl --fail --silent $URL > $Name
        # echo $data>$Name
        echo "SUCCESS! $URL"
    fi
    # echo wget -q -N $URL
    # wget -q -N $URL
}

for id in ${arr[@]}; do
    if [ ! -z $id ]; then
        Name=${id//$\s/}.jpg
        down "$base""$year"/$Name $Name
    fi
done

# cd $year

arr=(*)
for x in ${arr[@]}; do
    assign_file $x
done


