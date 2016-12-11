# Graduation Project Image Download

下载学生图片，来自教务网。

## 文件目录

```sh
gp-image-download/
├── data/        # 学生信息，来自get-all-id.js
│   ├── student-ids-2000.txt
│   ├── student-ids-2001.txt
│   ├── student-ids-2002.txt
│   ├── student-ids-2003.txt
│   ├── student-ids-2004.txt
│   ├── student-ids-2005.txt
│   ├── student-ids-2006.txt
│   ├── student-ids-2007.txt
│   ├── student-ids-2008.txt
│   ├── student-ids-2009.txt
│   ├── student-ids-2010.txt
│   ├── student-ids-2011.txt
│   ├── student-ids-2012.txt
│   ├── student-ids-2013.txt
│   ├── student-ids-2014.txt
│   ├── student-ids-2015.txt
│   ├── student-ids-2016.txt
│   └── students.json
├── download.sh # 下载脚本
├── get-all-id.js 
├── images/ # 图片存储目录
│   └── 2013/
├── lib/
│   └── get-all-id.js
├── node_modules/ # node 包
│   ├── babel-core/
│   └── babel-preset-stage-3/
├── package.json # 无视
└── readme.md

5 directories, 25 files.
```

## 说明

node实现 获取学生学号，在文件`data/students.json`, `data/student-ids-year.txt`中

bash实现 下载脚本（windows需要在git bash环境下）, 读取`data/student-ids-year.txt` 获得学号，wget工具下载


## 参考
- http://blog.chaiziyi.com.cn/2016/05/23/%E5%88%A9%E7%94%A8Python%E7%88%AC%E5%8F%96%E5%AD%A6%E6%A0%A1%E7%BD%91%E7%AB%99%E4%B8%8A%E7%9A%84%E8%AF%81%E4%BB%B6%E7%85%A7%EF%BC%88%E4%B8%89%EF%BC%89/  获取学生信息
- http://stackoverflow.com/questions/10442841/download-images-from-website
- windows环境使用wget  http://gnuwin32.sourceforge.net/packages/wget.htm         
    wget 加入环境变量

