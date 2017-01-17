# 毕设记录

- 2016年12月9日
	1. 初步确定课题：基于南师大本科生学生照片，进行人脸识别+特征提取+人脸相似度对比，判断输入人物图片是否存在于库中。若时间允许，精力有余，考虑加上声音比对，提高识别正确率。
	2. 成功下载南师大本科生照片，代码见`gp-image-download`文件夹，使用bash脚本+node实现，可以方便的跨平台。

- 2016年12月10日
	初步了解人脸识别检测。
	产生怀疑：
	1. 纯粹自己实现系列识别，特征提取，模式匹配等等。仅是识别算法理论，需要的数学功底较复杂...数学已经丢的差不多了..进度缓慢，无法入手，恐怕较难完成。
	2. 调用opencv接口或者调用网上api，恐怕工作量不够(应用交互设计完备点？)
	3. 换个课题？备选moka(1)或者iNjnu App(2)

- 2016年12月11日
	1. 搭建学生签到系统开发环境，采用`react + redux + react-router + webpack`技术栈，利用web前端技术实现界面，后续可以使用`electron`打包为跨平台app
	2. 注册`face++`账号，打算采用第三方人脸识别比对api
	
- 2016年12月12日
	1. 初步开发前端页面+后端服务(node express), 前后端分离
	2. 使用`Sublime`编辑器，默认缩进为`Tab`，书写脚本`updateIndent.js`，批量修改`Tab`为四空格
	
	3. 课题确定，《南师大学生刷脸签到系统》
	对于人脸识别+比对方面实现，初步考虑3个解决方案：
	1. 人脸识别+比对算法完全自己实现。
	2. 调用opencv人脸识别api + 自己实现人脸比对算法。
	3. 调用网上较成熟的人脸识别+人脸比对接口，如Face++。
	以上三种解决方案工作量递减（或者工作量可以在系统功能完备性方面体现），但是识别比对准确率递增。

	不知道老师对以上三种方案有什么看法。
	如果采用1或2，本人不知道应该看什么相关书籍入门(数学已经丢的差不多了，非考研党)，以及所用时间和最终效果都可能不尽人意。

	还有一个问题：面向学生的教务系统好像没有输入课程号，教师ID，输出全部选课学生ID的接口。或者在面向教师的教务系统才有提供，但我没有教师账号密码，不能自己爬取。不知道我应该联系谁，才可以提供该接口。
	
	4. 获取学号接口 http://urp.njnu.edu.cn/authorizeUsers.portal?start=0&limit=100&term=191301
	5. 根据爬取的学生照片，创建数据库stu(id, audio), sign(id, time, stu_id); 班级的判断，通过已经得到ids.txt前6位得到（去掉非纯数字的，位数不同的）
	6. 构思管理员入口 => 登录(判断是否已经登录) => 查看学生信息(根据学号，姓名，班级号) + 签到信息查看 

- 2016年12月13日
	1. 重拾数学
		- [积分](https://zh.wikipedia.org/wiki/%E7%A7%AF%E5%88%86)
		- [方差](https://zh.wikipedia.org/wiki/%E6%96%B9%E5%B7%AE)
		- [协方差](https://zh.wikipedia.org/wiki/%E5%8D%8F%E6%96%B9%E5%B7%AE)
		- [统计独立](https://zh.wikipedia.org/wiki/%E7%8B%AC%E7%AB%8B_(%E6%A6%82%E7%8E%87%E8%AE%BA))
		- [矩阵]()
		- [协方差矩阵*(写得好)](http://blog.csdn.net/itplus/article/details/11452743)
	2. 方差描述的是它的离散程度，也就是该变量离其期望值的距离。
	3. 协方差表示的是两个变量的总体的误差，这与只表示一个变量误差的方差不同。 如果两个变量的变化趋势一致，也就是说如果其中一个大于自身的期望值，另外一个也大于自身的期望值，那么两个变量之间的协方差就是正值。 如果两个变量的变化趋势相反，即其中一个大于自身的期望值，另外一个却小于自身的期望值，那么两个变量之间的协方差就是负值。
	4. https://trackingjs.com/bower/tracking.js/examples/face_camera.html （Js人脸检测插件，去掉手动拍照，监控摄像头识别人脸，可以根据searching和是否有人脸进行对比操作，只发送多个人脸部分图像）**看下源码，学习识别算法**

- 2016年12月14日
	1. opencv install:  
	
			brew tap homebrew/science
			brew install opencv
		https://www.learnopencv.com/install-opencv-3-on-yosemite-osx-10-10-x/  
		http://docs.opencv.org/2.4/doc/tutorials/introduction/linux_install/linux_install.html  
		http://www.pyimagesearch.com/2015/06/15/install-opencv-3-0-and-python-2-7-on-osx/
	2. 添加opencv依赖: http://docs.opencv.org/2.4/doc/tutorials/introduction/linux_gcc_cmake/linux_gcc_cmake.html
	3. brew更改源
		替换formula 索引的镜像（即 brew update 时所更新内容）
		```
		cd "$(brew --repo)"
		git remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git

		cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
		git remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git

		brew update
		```
		替换Homebrew 二进制预编译包的镜像
		```
		echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles' >> ~/.bash_profile
		source ~/.bash_profile
		```
	4. [node-opencv](https://github.com/peterbraden/node-opencv)  
		Issue: https://github.com/peterbraden/node-opencv/issues/380#issuecomment-191492421

- 2016年12月16日
	1. 使用node-opencv检测人脸，挑选出效果相对好的分类模板`lbpcascade_frontalface.xml`, 对比效果数据见`backend/data/summary.json`
	2. 死嚼PCA理论[1](http://blog.csdn.net/itplus/article/details/11451327), [2](http://blog.csdn.net/liulina603/article/details/7912950)

- 2016年12月18日
    1. http://www.freeformatter.com/xml-to-json-converter.html(需VPN)
    2. 发现人脸识别效果不佳，分析原因， 第一，样本每个人只有一张 ，第二，几年下来，人的变化比较大。
    3. 新增样本输入模块，学生自主输入删除样本。（需要重新训练，存储）
- 2017年1月11日
	`image-download`去除对`wget`依赖，改用`curl`指令下载

- 2017年1月16日
	1. `/usr/local/bin/mysql.server start` 启动mysql
	2. 开始`mysql`数据库设计: `face_import table`, 书写DAO代码
	3. 简化部分业务逻辑，删除非必须输入情况(本地图片，网络图片)
	4. 考虑到数据的迁移简便和服务器负载，使用`sm.ms`免费图床，存储用户导入的人脸图片
	5. 完成100%人脸录入逻辑。TODO: 每次启动服务器需要读取数据库，得到smms图片数据，进行训练。（为了保证Dev环境启动速度，暂时不做）
	6. 引入`cross-env`：跨平台设置环境变量NPM包, 区分Dev(父进程监听js文件改动，改动后则重启服务器)与Production环境
- 2017年1月17日
	1. 改善训练样本方法，加上了smms外链的图片训练(一大串Promise)
	2. 完成前后道分离的管理员登录状态控制，完成管理员样本查看功能。
	3. 