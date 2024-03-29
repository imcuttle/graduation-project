#include "opencv2/core/core.hpp"
#include "opencv2/highgui/highgui.hpp"
#include "opencv2/contrib/contrib.hpp"

#include <iostream>
#include <fstream>
#include <sstream>

//using namespace cv;
using namespace std;

//把图像归一化为0-255，便于显示
cv::Mat norm_0_255(const cv::Mat& src)
{
    cv::Mat dst;
    switch(src.channels())
    {
        case 1:
            cv::normalize(src, dst, 0, 255, cv::NORM_MINMAX, CV_8UC1);
            break;
        case 3:
            cv::normalize(src, dst, 0, 255, cv::NORM_MINMAX, CV_8UC3);
            break;
        default:
            src.copyTo(dst);
            break;
    }
    return dst;
}

//转化给定的图像为行矩阵
cv::Mat asRowMatrix(const vector<cv::Mat>& src, int rtype, double alpha = 1, double beta = 0)
{
    //样本数量
    size_t n = src.size();
    //如果没有样本，返回空矩阵
    if(n == 0)
        return cv::Mat();
    //样本的维数
    size_t d = src[0].total();

    cv::Mat data(n, d, rtype);
    //拷贝数据
    for(int i = 0; i < n; i++)
    {

        if(src[i].empty())
        {
            string error_message = cv::format("Image number %d was empty, please check your input data.", i);
            CV_Error(CV_StsBadArg, error_message);
        }
        // 确保数据能被reshape
        if(src[i].total() != d)
        {
            string error_message = cv::format("Wrong number of elements in matrix #%d! Expected %d was %d.", i, d, src[i].total());
            CV_Error(CV_StsBadArg, error_message);
        }
        cv::Mat xi = data.row(i);
        //转化为1行，n列的格式
        if(src[i].isContinuous())
        {
            src[i].reshape(1, 1).convertTo(xi, rtype, alpha, beta);
        } else {
            src[i].clone().reshape(1, 1).convertTo(xi, rtype, alpha, beta);
        }
    }
    return data;
}

void pca() {
    vector<cv::Mat> db;

    string prefix = "/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/data/images/2013/191301/lbpcascade_frontalface/opts{\"scale\":1.95}/";
    db.push_back(imread(prefix + "19130101.jpg", cv::IMREAD_GRAYSCALE));
    db.push_back(imread(prefix + "19130102.jpg", cv::IMREAD_GRAYSCALE));
    db.push_back(imread(prefix + "19130103.jpg", cv::IMREAD_GRAYSCALE));
    db.push_back(imread(prefix + "19130104.jpg", cv::IMREAD_GRAYSCALE));

    // Build a matrix with the observations in row:
    cv::Mat data = asRowMatrix(db, CV_32FC1);

    // PCA算法保持5主成分分量
    int num_components = 5;

    //执行pca算法
    cv::PCA pca(data, cv::Mat(), CV_PCA_DATA_AS_ROW, num_components);

    //copy  pca算法结果
    cv::Mat mean = pca.mean.clone();
    cv::Mat eigenvalues = pca.eigenvalues.clone();
    cv::Mat eigenvectors = pca.eigenvectors.clone();

    //均值脸
    cv::imshow("avg", norm_0_255(mean.reshape(1, db[0].rows)));

    //五个特征脸
    cv::imshow("pc1", norm_0_255(pca.eigenvectors.row(0)).reshape(1, db[0].rows));
    cv::imshow("pc2", norm_0_255(pca.eigenvectors.row(1)).reshape(1, db[0].rows));
    cv::imshow("pc3", norm_0_255(pca.eigenvectors.row(2)).reshape(1, db[0].rows));
    cv::imshow("pc4", norm_0_255(pca.eigenvectors.row(3)).reshape(1, db[0].rows));
    cv::imshow("pc5", norm_0_255(pca.eigenvectors.row(4)).reshape(1, db[0].rows));

    while(1)
        cv::waitKey(0);

    // Success!
}
