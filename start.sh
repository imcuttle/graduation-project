#!/bin/bash

# mysqldump -u root gp -p > gp.sql



echoerr() { echo "$@" 1>&2; }
command_exists () {
    type "$1" &> /dev/null;
}
command_exists_exit() {
    if ! command_exists "$1" ; then
        echoerr "${1} command not exists"
        exit
    fi
}

command_exists_exit git
command_exists_exit npm
command_exists_exit node
command_exists_exit mysql


if [ -d face-njnu ]; then
    (cd face-njnu && git pull)
else
    git clone https://github.com/moyuyc/graduation-project.git face-njnu
fi

read -p "which year do you want to download? (2013) [2013/n] " REPLY
if [[ $REPLY =~ ^[\s]*$ ]]; then
    YEAR=2013
    echo "Downloading... Year=$YEAR"
    (cd face-njnu/gp-image-download && ./download.sh $YEAR)
elif [[ $REPLY =~ ^[nN]$ ]]; then
    echo "Skipped Download Images"
else
    YEAR=$REPLY
    echo "Downloading... Year=$YEAR"
    (cd face-njnu/gp-image-download && ./download.sh $YEAR)
fi

echo "mysql data importing"
read -p "Are you sure import sql data? [y/n]" REPLY
if [[ $REPLY =~ ^[yY]$ ]]; then
    read -p "Username(root): " REPLY
    if [[ $REPLY =~ ^[\s]*$ ]]; then
        USER=root
    else
        USER=$REPLY
    fi

    mysql -u $USER -p gp < face-njnu/gp.sql
fi

read -p "Are you sure install opencv? [y/n]" REPLY
if [[ $REPLY =~ ^[yY]$ ]]; then
    if command_exists apt-get; then
        sudo apt-get install build-essential
        sudo apt-get install cmake git libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev
    fi

    if command_exists wget ; then
        wget -O ~/opencv.zip https://github.com/opencv/opencv/archive/2.4.13.1.zip
        # wget -O ~/opencv.zip http://downloads.sourceforge.net/project/opencvlibrary/opencv-unix/2.4.11/opencv-2.4.11.zip
        # wget -O ~/opencv.zip https://sourceforge.net/projects/opencvlibrary/files/opencv-unix/3.1.0/opencv-3.1.0.zip
        unzip opencv.zip
        mv ~/opencv-2.4.13.1 ~/opencv
        # wget -O opencv_contrib.zip https://github.com/Itseez/opencv_contrib/archive/3.1.0.zip
        # unzip opencv_contrib.zip
    else
        # git clone https://github.com/Itseez/opencv_contrib.git ~/opencv_contrib
        git clone https://github.com/opencv/opencv.git ~/opencv
        (cd ~/opencv && git checkout 2.4)
    fi
    (cd ~/opencv && rm -rf release && mkdir release \
        && cd release && \ # ~/opencv_contrib/modules:
        cmake -D CMAKE_BUILD_TYPE=RELEASE -D CMAKE_INSTALL_PREFIX=/usr/local .. \
        && make \
        && sudo make install)
fi

if command_exists node-gyp ;
    npm install node-gyp -g --registry=https://registry.npm.taobao.org
fi

cd face-njnu
npm install --registry=https://registry.npm.taobao.org
cd gp-njnu-photos-backend
npm install --registry=https://registry.npm.taobao.org
(cd opencv && npm run install )
npm run retrain && npm run start





