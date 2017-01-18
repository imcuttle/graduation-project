# 后端服务器 + 部分预处理


## Scripts
```
npm run gface # detect face, then gray, save
# eg.  $ npm run grayface 2013 191301
#      $ npm run grayface 2013
#      $ npm run grayface

# eg.  $ node pretreat/train_save.js -f --args 2013
#      $ node pretreat/train_save.js -f --args 2013 191301

"scripts": {
    "grayface": "node pretreat/gray_face.js",
    "train:force": "node pretreat/train_save.js -f",
    "train:smart": "node pretreat/train_save.js",
    "savestus": "node pretreat/save_stus.js",
    "dev": "cross-env NODE_ENV=dev node .",
    "start": "node .",
    "retrain": "npm run grayface && npm run train:force",
    "retrain:dev": "npm run grayface 2013 191301 && node pretreat/train_save.js -f --args 2013 191301",
    "test": "echo \"Error: no test specified\" && exit 1"
}
```
