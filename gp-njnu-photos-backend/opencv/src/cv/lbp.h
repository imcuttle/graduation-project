#ifndef NODE_CV_LBP_H
#define NODE_CV_LBP_H
#include "../OpenCV.h"

//using namespace cv;

void circle_lbp(cv::Mat& src, cv::Mat &dst, int radius, int neighbors) {

    for(int n=0; n<neighbors; n++) {
        // 采样点的计算
        float x = static_cast<float>(-radius * sin(2.0*CV_PI*n/static_cast<float>(neighbors)));
        float y = static_cast<float>(radius * cos(2.0*CV_PI*n/static_cast<float>(neighbors)));
        // 上取整和下取整的值
        int fx = static_cast<int>(floor(x));
        int fy = static_cast<int>(floor(y));
        int cx = static_cast<int>(ceil(x));
        int cy = static_cast<int>(ceil(y));
        // 小数部分
        float ty = y - fy;
        float tx = x - fx;
        // 设置插值权重
        float w1 = (1 - tx) * (1 - ty);
        float w2 =      tx  * (1 - ty);
        float w3 = (1 - tx) *      ty;
        float w4 =      tx  *      ty;
        // 循环处理图像数据
        for(int i=radius; i < src.rows-radius;i++) {
            for(int j=radius;j < src.cols-radius;j++) {
                // 计算插值
                float t = static_cast<float>(w1*src.at<uchar>(i+fy,j+fx) + w2*src.at<uchar>(i+fy,j+cx) + w3*src.at<uchar>(i+cy,j+fx) + w4*src.at<uchar>(i+cy,j+cx));
                // 进行编码
                dst.at<uchar>(i-radius,j-radius) += ((t > src.at<uchar>(i,j)) || (std::abs(t-src.at<uchar>(i,j)) < std::numeric_limits<float>::epsilon())) << n;
            }
        }
    }
}

void rect_lbp(cv::Mat& src, cv::Mat &dst) {

    for(int i=1; i < src.rows-1;i++) {
        for(int j=1;j < src.cols-1;j++) {
            uchar tt = 0;
            int tt1 = 0;
            uchar u = src.at<uchar>(i,j);
            if(src.at<uchar>(i-1,j-1)>u) { tt += 1 <<tt1; }
            tt1++;
            if(src.at<uchar>(i-1,j)>u) { tt += 1 <<tt1; }
            tt1++;
            if(src.at<uchar>(i-1,j+1)>u) { tt += 1 <<tt1; }
            tt1++;
            if(src.at<uchar>(i,j+1)>u) { tt += 1 <<tt1; }
            tt1++;
            if(src.at<uchar>(i+1,j+1)>u) { tt += 1 <<tt1; }
            tt1++;
            if(src.at<uchar>(i+1,j)>u) { tt += 1 <<tt1; }
            tt1++;
            if(src.at<uchar>(i+1,j-1)>u) { tt += 1 <<tt1; }
            tt1++;
            if(src.at<uchar>(i-1,j)>u) { tt += 1 <<tt1; }
            tt1++;

            dst.at<uchar>(i-1,j-1) = tt;
        }
    }
}

#endif
