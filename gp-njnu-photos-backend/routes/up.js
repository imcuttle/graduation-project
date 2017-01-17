
const express = require('express')
const up = express()
const p = require('path')

const utils = require('../lib/utils')
const smmsUpload = require('../lib/smms').upload
const njnuApi = require('../lib/njnu')
const train = require('../pretreat/train_save')
const faceImportDB = require('../database/face-import')

const obj = utils.obj


up.post('/predict/base64', (req, res) => {
    const ent = req.ent;
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


up.post('/face-import/base64', (req, res) => {
    const ent = req.ent;
    const data = ent.data, stuid = ent.stuno, stupwd = ent.stupwd;

    const rlt = utils.decodeBase64Image(data);
    if(!stuid || !stupwd) {
        res.json(obj(400, '请输入学号密码'))
    } else if(rlt.data > 1024*1024*5) {
        res.json(obj(400, "图片太大了!"))
    } else {
        njnuApi.getStudentInfo(stuid.trim(), stupwd.trim())
            .then(info =>
                info ? faceImportDB.select(stuid).then(existList => existList.length>=8)
                        .then(over => !over
                        ? train.faceRecImageBuffer(rlt.data).then(
                                (faceBuffer) => smmsUpload(faceBuffer).then(data =>
                                    data ? faceImportDB.insert(stuid.trim(), data.hash, data.url)
                                            .then(isok => isok ? obj(200, data): obj(500, "上传失败"))
                                        : obj(500, "上传失败")),
                                (err) => obj(500, err.message + '人脸识别失败')
                            )
                        : obj(500, '已经到达样本上限'))
                     : obj(500, '请输入正确的学号密码')
            ).catch(err=> obj(502, err.stack))
            .then(o => res.json(o));
    }
})


module.exports = up
