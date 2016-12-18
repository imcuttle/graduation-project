
const express = require('express')
const up = express()
const p = require('path')

const utils = require('../lib/utils')

const train = require('../pretreat/train_save')

const obj = utils.obj


up.post('/predict/base64', (req, res) => {
    const ent = req.ent
    const data = ent.data, cls = ent.cls
    const rlt = utils.decodeBase64Image(data);
    if(rlt.data > 1024*1024*2) {
        res.json(obj(400, "图片太大了!"))
    } else {
        train.predict(cls, rlt.data)
        .then(id => id?obj(200, id):obj(400, '没找到匹配学生')).catch(e=>obj(500, e.message))
        .then(o=>res.json(o))
    }
})

module.exports = up
