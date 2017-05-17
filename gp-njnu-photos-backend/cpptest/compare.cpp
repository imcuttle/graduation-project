#include "opencv2/core/core.hpp"
#include "opencv2/highgui/highgui.hpp"
#include "opencv2/contrib/contrib.hpp"

#include <iostream>
#include <fstream>
#include <sstream>
#include <dirent.h>
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

bool startsWith(const char *pre, const char *str)
{
    size_t lenpre = strlen(pre), lenstr = strlen(str);
    return lenstr < lenpre ? false : strncmp(pre, str, lenpre) == 0;
}

vector<string> readdir(string path)
{
    DIR *dir;
    struct dirent *ent;
    vector<string> paths;
    if ((dir = opendir(path.c_str())) != NULL) {
        /* print all the files and directories within directory */
        while ( (ent = readdir (dir)) != NULL ) {
            if (!startsWith(".", ent->d_name)) {
//                printf ("%s\n", ent->d_name);
                paths.push_back(ent->d_name);
            }
        }
        closedir (dir);
    } else {
        /* could not open directory */
        perror ("");
    }
    return paths;
}


void output_rec_result(ofstream& result_file, string title, Ptr<FaceRecognizer> model, vector<Mat> db, vector<int> labels, Mat testSample, vector<string> names, string ipt_path) {
    double confidence = 0.0;
    int predictedLabel = -1;
    clock_t  t_start, t_end;

    result_file << "<div style=\"display: inline-block; margin: 10px;\">" << endl;

    result_file << "<h4>" << title << "</h4>" << endl;

    t_start = clock();
    model->train(db, labels);
    t_end = clock();
    result_file << "<div>训练时间：" << ((double)(t_end - t_start) / CLOCKS_PER_SEC) << "s</div>" << endl;

    t_start = clock();
    model->predict(testSample, predictedLabel, confidence);
    t_end = clock();
    result_file << "<div>预测时间：" << ((double)(t_end - t_start) / CLOCKS_PER_SEC) << "s</div>" << endl;

    result_file << "<div>distance：" << confidence << "</div>" << endl;
//    cout << "predictedLabel=" << predictedLabel << endl;
//    cout << "max confidence=" << model->getDouble("threshold") << endl;


//    streambuf *coutbuf = cout.rdbuf();
//    cout.rdbuf(result_file.rdbuf());


    result_file << "<div>检测结果: " << "<img style=\"vertical-align: top;\" src=\"" << names[predictedLabel] << "\"/>" << "</div>" << endl;

    result_file << "</div>" << endl;
}


int main(int argc, const char *argv[])
{

//    string class_path = "/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/data/images/2013/191301/";
//    string prefix = "/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/cpptest/sample/";
    vector<string> sample_paths;

//    string ipt_path = "/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/cpptest/sample/c-2.jpg";
//    string ipt_path = "/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/data/images/2013/191301/19130111.jpg";
//    string ipt_path = "/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/cpptest/b-1.jpg";


//    string ipt_path = "/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/cpptest/emotion-samples/s1/1.jpg";
//    string ipt_path = "/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/cpptest/emotion-samples/s2/1.jpg";
//    string ipt_path = "/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/cpptest/emotion-samples/s3/5.jpg";
//    string ipt_path = "/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/cpptest/emotion-samples/s4/9.jpg";
//    string ipt_path = "/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/cpptest/emotion-samples/s5/10.jpg";

//    sample_paths.push_back("/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/cpptest/emotion-samples/s1/");
//    sample_paths.push_back("/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/cpptest/emotion-samples/s2/");
//    sample_paths.push_back("/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/cpptest/emotion-samples/s3/");
//    sample_paths.push_back("/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/cpptest/emotion-samples/s4/");
//    sample_paths.push_back("/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/cpptest/emotion-samples/s5/");

//    string ipt_path = "/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/cpptest/illumination-samples/1/5.jpg";
//    string ipt_path = "/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/cpptest/illumination-samples/2/1.jpg";
//    string ipt_path = "/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/cpptest/illumination-samples/3/2.jpg";
//    string ipt_path = "/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/cpptest/illumination-samples/4/3.jpg";

    sample_paths.push_back("/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/cpptest/illumination-samples/1/");
    sample_paths.push_back("/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/cpptest/illumination-samples/2/");
    sample_paths.push_back("/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/cpptest/illumination-samples/3/");
    sample_paths.push_back("/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/cpptest/illumination-samples/4/");

    vector<string> names;
    vector<int> labels;
    /*vector<string> paths = readdir(class_path);
    for (int i=0; i<paths.size(); i++) {
        paths[i] = class_path+paths[i];
    }
    vector<string> tmp = readdir(prefix);
    for (int i=0; i<tmp.size(); i++) {
        tmp[i] = prefix+tmp[i];
    }*/
    vector<string> paths;
    for(int i = 0; i < sample_paths.size(); i++)
    {
        string dir = sample_paths[i];
        vector<string> tmp = readdir(dir);
        for (int i=0; i<tmp.size(); i++) {
            tmp[i] = dir+tmp[i];

            /*int pos = (int) tmp[i].find_last_of(".");
            if (pos>=0) {
                string name = tmp[i].substr(0, pos)+".jpg";
                imwrite(name, imread(tmp[i]));
                tmp[i] = name;
            }*/
        }
        paths.insert(paths.end(), tmp.begin(), tmp.end());
    }

    vector<Mat> db;

    int autoinc = 0;
    for (vector<string>::iterator it = paths.begin() ; it != paths.end(); ++it) {
//        cout << *it << endl;
        if (strcmp(ipt_path.c_str(), it->c_str()) != 0) {
            names.push_back(*it);
            labels.push_back(autoinc++);
            db.push_back(imread(*it, IMREAD_GRAYSCALE));
        }
    }

    Mat testSample = imread(ipt_path, IMREAD_GRAYSCALE);

    Ptr<FaceRecognizer> model;
    ofstream result_file("result.html", ios::app);

    result_file << "<div style=\"display:inline-block;vertical-align: middle;\"><div>输入图片</div>" << "<img style=\"vertical-align: top;\" src=\""<< ipt_path << "\"/>" << "</div>" << endl;

    model = createEigenFaceRecognizer(10);
    output_rec_result(result_file, "EigenFace", model, db, labels, testSample, names, ipt_path);

    model = createFisherFaceRecognizer(10);
    output_rec_result(result_file, "FisherFace", model, db, labels, testSample, names, ipt_path);

    model = createLBPHFaceRecognizer(1, 8, 8, 8, 80);
    output_rec_result(result_file, "LBPH", model, db, labels, testSample, names, ipt_path);

    result_file << "<br/>" << endl;

//    cout << "confidence=" << confidence << endl;

//    imshow("待检测", imread(ipt_path));
//    imshow("检测结果", imread(names[predictedLabel]));
//    waitKey(0);
}

