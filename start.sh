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

# git clone https://github.com/moyuyc/graduation-project.git face-njnu

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

    echo -n Password(110114): 
    read -s REPLY
    if [[ $REPLY =~ ^[\s]*$ ]]; then
        PWD=110114
    else
        PWD=$REPLY
    fi

    mysql -u $USER -p $PWD gp < face-njnu/gp.sql
fi

cd face-njnu/gp-njnu-photos-backend
npm run retrain && npm run start





