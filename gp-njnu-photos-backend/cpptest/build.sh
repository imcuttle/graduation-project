#/usr/sh
g++ $(pkg-config --cflags --libs opencv) three_method.cpp -o Three

g++ $(pkg-config --cflags --libs opencv) main.cpp -o Main
