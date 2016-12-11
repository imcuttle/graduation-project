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

IFS=$'\r\n'

readarray arr < ../../data/student-ids-$year.txt

echo ${arr[-1]}

down() {
	URL=$1
	echo wget -q -N $URL
	wget -q -N $URL
}

for id in ${arr[@]}; do
	if [ ! -z $id ]; then
		down "$base""$year"/${id//$\s/}.jpg
	fi
done
