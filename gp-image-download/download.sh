#!/bin/sh

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


echo ${arr[-1]}

down() {
    URL=$1
    Name=${URL##*/}
    Classno=${Name:0:6}
    if [ ! -d $Classno ]; then
        mkdir $Classno
    fi
    echo wget -q -N $URL -O "$Classno"/"$Name"
    wget -q -N $URL -O "$Classno"/"$Name"
}

for id in ${arr[@]}; do
    if [ ! -z $id ]; then
        down "$base""$year"/${id//$\s/}.jpg
    fi
done
