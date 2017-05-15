#include "opencv2/core/core.hpp"
#include "opencv2/highgui/highgui.hpp"
#include "opencv2/contrib/contrib.hpp"

#include <iostream>
#include <fstream>
#include <sstream>
//#include <tclDecls.h>

using namespace cv;
using namespace std;

//把图像归一化为0-255，便于显示
Mat norm_0_255(const Mat& src)
{
    Mat dst;
    switch(src.channels())
    {
        case 1:
            cv::normalize(src, dst, 0, 255, NORM_MINMAX, CV_8UC1);
            break;
        case 3:
            cv::normalize(src, dst, 0, 255, NORM_MINMAX, CV_8UC3);
            break;
        default:
            src.copyTo(dst);
            break;
    }
    return dst;
}

//转化给定的图像为行矩阵
Mat asRowMatrix(const vector<Mat>& src, int rtype, double alpha = 1, double beta = 0)
{
    //样本数量
    size_t n = src.size();
    //如果没有样本，返回空矩阵
    if(n == 0)
        return Mat();
    //样本的维数
    size_t d = src[0].total();

    Mat data(n, d, rtype);
    //拷贝数据
    for(int i = 0; i < n; i++)
    {

        if(src[i].empty())
        {
            string error_message = format("Image number %d was empty, please check your input data.", i);
            CV_Error(CV_StsBadArg, error_message);
        }
        // 确保数据能被reshape
        if(src[i].total() != d)
        {
            string error_message = format("Wrong number of elements in matrix #%d! Expected %d was %d.", i, d, src[i].total());
            CV_Error(CV_StsBadArg, error_message);
        }
        Mat xi = data.row(i);
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

void pca_run();
void pca_rec();

int main(int argc, const char *argv[])
{
    pca_rec();
}

void pca_rec()
{
    string prefix = "/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/cpptest/img/";
    vector<Mat> db;
    db.push_back(imread(prefix + "1.jpg", IMREAD_GRAYSCALE));
    db.push_back(imread(prefix + "2.jpg", IMREAD_GRAYSCALE));
    db.push_back(imread(prefix + "3.jpg", IMREAD_GRAYSCALE));
    db.push_back(imread(prefix + "4.jpg", IMREAD_GRAYSCALE));

    // Build a matrix with the observations in row:
    Mat data = asRowMatrix(db, CV_32FC1);

    int num_components = 5;

    PCA pca(data, Mat(), CV_PCA_DATA_AS_ROW, num_components);
    Mat weightMat = pca.project(data);

    printf("欧氏距离：%f\n", norm(weightMat.row(0), weightMat.row(1), CV_L2));
    printf("欧氏距离：%f\n", norm(weightMat.row(0), weightMat.row(2), CV_L2));
    printf("欧氏距离：%f\n", norm(weightMat.row(1), weightMat.row(2), CV_L2));

    printf("欧氏距离：%f\n", norm(weightMat.row(3), weightMat.row(2), CV_L2));

    cout << "M = "<< endl << " "  << weightMat << endl << endl;
    cout << "pca.eigenvalues = "<< endl << " "  << pca.eigenvalues << endl << endl;
    cout << "pca.eigenvectors = "<< endl << " "  << pca.eigenvectors << endl << endl;
}

void pca_run()
{
    vector<Mat> db;

    string prefix = "/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/data/images/2013/191301/";
    db.push_back(imread(prefix + "19130101.jpg", IMREAD_GRAYSCALE));
    db.push_back(imread(prefix + "19130102.jpg", IMREAD_GRAYSCALE));
    db.push_back(imread(prefix + "19130103.jpg", IMREAD_GRAYSCALE));
    db.push_back(imread(prefix + "19130104.jpg", IMREAD_GRAYSCALE));
    db.push_back(imread(prefix + "19130105.jpg", IMREAD_GRAYSCALE));

    // Build a matrix with the observations in row:
    Mat data = asRowMatrix(db, CV_32FC1);

    // PCA算法保持5主成分分量
    int num_components = 5;

    //执行pca算法
    PCA pca(data, Mat(), CV_PCA_DATA_AS_ROW, num_components);

    //copy  pca算法结果
    Mat mean = pca.mean.clone();
    Mat eigenvalues = pca.eigenvalues.clone();
    Mat eigenvectors = pca.eigenvectors.clone();

    //均值脸
    imwrite("avg.jpg", norm_0_255(mean.reshape(1, db[0].rows)));


    //五个特征脸
    imwrite("pc1.jpg", norm_0_255(pca.eigenvectors.row(0)).reshape(1, db[0].rows));
    imwrite("pc2.jpg", norm_0_255(pca.eigenvectors.row(1)).reshape(1, db[0].rows));
    imwrite("pc3.jpg", norm_0_255(pca.eigenvectors.row(2)).reshape(1, db[0].rows));
    imwrite("pc4.jpg", norm_0_255(pca.eigenvectors.row(3)).reshape(1, db[0].rows));
    imwrite("pc5.jpg", norm_0_255(pca.eigenvectors.row(4)).reshape(1, db[0].rows));

    Mat weightMat = pca.project(data);
    Mat backProject = pca.backProject(weightMat);
    //五个特征脸复原
    imwrite("pc1-restore.jpg", norm_0_255(backProject.row(0)).reshape(1, db[0].rows));
    imwrite("pc2-restore.jpg", norm_0_255(backProject.row(1)).reshape(1, db[0].rows));
    imwrite("pc3-restore.jpg", norm_0_255(backProject.row(2)).reshape(1, db[0].rows));
    imwrite("pc4-restore.jpg", norm_0_255(backProject.row(3)).reshape(1, db[0].rows));
    imwrite("pc5-restore.jpg", norm_0_255(backProject.row(4)).reshape(1, db[0].rows));

    //五个特征脸
//    imwrite("pc-1.jpg", pca.eigenvectors.row(0).reshape(1, db[0].rows));
//    imwrite("pc-2.jpg", pca.eigenvectors.row(1).reshape(1, db[0].rows));
//    imwrite("pc-3.jpg", pca.eigenvectors.row(2).reshape(1, db[0].rows));
//    imwrite("pc-4.jpg", pca.eigenvectors.row(3).reshape(1, db[0].rows));
//    imwrite("pc-5.jpg", pca.eigenvectors.row(4).reshape(1, db[0].rows));


}
