cmake_minimum_required(VERSION 3.6)
project(graduation-project)

set(CMAKE_CXX_STANDARD 11)

set(SOURCE_FILES main.cpp)
add_executable(cppsrc ${SOURCE_FILES})

find_package( OpenCV REQUIRED )
target_link_libraries( DisplayImage ${OpenCV_LIBS} )
