# Graduation Project Image Download

下载学生图片，来自教务网。
使用bash脚本+nodejs实现，可以方便的跨平台。

需要环境： nodejs >6.0, bash

基本工作流程原理： 

1. 分析学生证件照 url 路由规则： 
 http://${hostname}/jwgl/photos/rx${year}/${studentno}.jpg ，hostname就是教务系统的主机地址，year就是入年份，studentno是学生学号，比如某学生学号是19140429，其中学号的3-4位表示入学年份，表示学生是 2014 年入学，那么他的学生证 URL 就是 http://223.2.10.123/jwgl/photos/rx2014/19140429

2. 通过 http://urp.njnu.edu.cn/authorizeUsers.portal 地址请求得到同学们的学号集合，写入文件中（nodejs 实现）
如：http://urp.njnu.edu.cn/authorizeUsers.portal?limit100&term191301，term 表示搜索关键字，可以是 1913/191301/... 将会返回学号中含有其字符串的数据，limit则是数据数最大限制，通过这个接口便可以得到学号集合

3. 最后便是学生照片下载的代码书写了。 采用的是 Bash Script 书写，具有较强的易用性，不需要复杂的平台、环境依赖。第一版是使用 wget 指令进行下载，但是该指令在 windows/osx 需要额外安装，所以最后改成了 curl 指令下载。

抓取图片与下载结果看图片：

![](https://ooo.0o0.ooo/2017/01/22/5884923dd9155.jpg)
![](https://ooo.0o0.ooo/2017/01/22/5884926960c79.jpg)

文件夹里面放的是将教务系统的学生图片下载至该文件夹中，其中的 data/ 文件夹放的是各年入学的学生的学号（部分学号不正确），数据是 get-all-id.js 脚本得到，具体细节请看代码。保证获取到各年的学生学号集后，通过 download.sh Bash 脚本即可进行下载；下载的图片放在当前 images/ 文件夹中。

执行js 脚本之前需要安装 node>6.0
之后在目录中执行 npm install 安装需要的第三方依赖包，才能正确执行。


## 部分代码解释

- get-all-id.js(获取ID集合)

```
// gp-image-download/lib/get-all-id.js
// language: javascript
// env: node
// usage: (cd gp-image-download && node get-all-id.js)

const URL = "http://urp.njnu.edu.cn/authorizeUsers.portal"
const STU_FILE = "data/students.json"
// 需要在浏览器先登录，得到已登录的 Cookie
const COOKIE = "njnuurpnew=ac16c83bd341d8ba0c3f2f092378; JSESSIONID=0001gcUXI0GWjdQg_ptI6NGAFaf:-5B0INP"

/* 请求 URL，写入 COOKIE，得到数据个数 recordCount */
async function getLimit() {
    try {
        const x = await get({
            ...url.parse(URL),
            headers: { cookie: COOKIE }
        })
        // console.log('xx', x)
        const json = JSON.parse(x)
        return json.recordCount
    } catch (ex) {
        console.error(ex);
    }
}

/* 请求 URL，写入 COOKIE，得到全部学生集合 */
async function getStuIds(limit) {
    try {
        const x = await get({
            ...url.parse(URL+"?limit="+limit),
            headers: { cookie: COOKIE }
        })

        const json = JSON.parse(x)
        return json.principals.filter(x=>{
            let metier = x.metier.trim();
            return metier=='本专科生'
        })
    } catch (ex) {
        console.error(ex);
    }
}

/* 由于全部学生数据量比较大，所以写入文件，下次读取文件即可 */
async function writeStudents() {
    const limit = await getLimit()
    const stus = await getStuIds(limit)

    console.log('writing "%s"', STU_FILE)
    fs.writeFileSync(STU_FILE, JSON.stringify(stus, null, 4))

    assignStuIds()
}

/* 读取全部学生数据，按照入学年份区分，得到以\r\n分割的学号集合文件 */
function assignStuIds() {
    const stus = JSON.parse(fs.readFileSync(STU_FILE))

    let all = stus.reduce((p, n) => {
        //19130126
        if(/^[\d]{8}$/.test(n.id)) {
            let num = n.id.substr(2, 2);
            let year = "20"+num;
            if(year>YEAR || isNaN(num)) return p
            p[year] = p[year] || ''
            p[year] += n.id+'\r\n'
        }
        return p
    }, {})

    Object.keys(all).forEach(k =>{
        let v = all[k];
        console.log('writing "%s"', "data/student-ids-"+k+".txt")
        fs.writeFile("data/student-ids-"+k+".txt", v.replace(/\r\n$/, ''), ()=>{})
    })
}
```

- download.sh(下载图片脚本)

```
#!/bin/bash
# gp-image-download/download.sh
# language: bash script
# env: bash
# usage: (cd gp-image-download && ./download.sh 2013)

base="http://223.2.10.123/jwgl/photos/rx"
year="2013"

# 没有 images/ 文件夹则新建，健壮性
if [ ! -d images ]; then
    echo mkdir images
    mkdir images
fi
cd images
# 将year赋值为第一个参数，默认为 2013
if [ ! -z "$1" ]; then
    year=$1
fi
echo year=$year

if [ ! -d $year ]; then
    echo mkdir $year
    mkdir $year
fi
cd $year

# 读取上一步获取的学号集合，放入arr
while IFS=$'\r\n' read var; do
    arr+=($var)
done < ../../data/student-ids-$year.txt

# 将下载好的图片，按照 学年/班级/图片 放置
assign_file() {
    Name=${1##*/}
    Classno=${Name:0:6}
    if [ ! -d $Classno ]; then
        mkdir $Classno
    fi
    mv $Name "$Classno"/
}

# 下载图片
# params: $1 url; $2 filename
down() {
    URL=$1
    Name=$2
    data=`curl --fail --silent $URL` 
    # "$data" 不能少  因为data中可能包含[]
    if [ ! -z "$data" ]; then
        curl --fail --silent $URL > $Name
        echo "SUCCESS! $URL"
    fi
}

# 遍历arr，下载
for id in ${arr[@]}; do
    if [ ! -z $id ]; then
        Name=${id//$\s/}.jpg
        down "$base""$year"/$Name $Name
    fi
done

# 下载结束后，重新放置文件
arr=(*)
for x in ${arr[@]}; do
    assign_file $x
done
```


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

**2017年01月11日更新**
去除对`wget`的依赖，直接使用`curl`进行图像数据下载. 


## 参考
- http://blog.chaiziyi.com.cn/2016/05/23/%E5%88%A9%E7%94%A8Python%E7%88%AC%E5%8F%96%E5%AD%A6%E6%A0%A1%E7%BD%91%E7%AB%99%E4%B8%8A%E7%9A%84%E8%AF%81%E4%BB%B6%E7%85%A7%EF%BC%88%E4%B8%89%EF%BC%89/  获取学生信息
- http://stackoverflow.com/questions/10442841/download-images-from-website
- windows环境使用wget  http://gnuwin32.sourceforge.net/packages/wget.htm         
    wget 加入环境变量
- linux下若不存在`wget`, 可以使用`brew install wget`, 需要已经安装`brew`.



