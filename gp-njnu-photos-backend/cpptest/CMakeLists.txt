cmake_minimum_required(VERSION 3.6)
project(graduation-project)



set(SOURCE_FILES three_method.cpp)
add_executable(Main ${SOURCE_FILES})
find_package( OpenCV REQUIRED )
target_link_libraries( Main ${OpenCV_LIBS} )