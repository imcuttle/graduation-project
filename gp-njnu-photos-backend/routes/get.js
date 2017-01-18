
const express = require('express')
const get = express()
const p = require('path')

const utils = require('../lib/utils')
const njnuApi = require('../lib/njnu')
const train = require('../pretreat/train_save')
const faceImportDB = require('../database/face-import')

const obj = utils.obj


get.get('/face-import/:stuno', (req, res) => {
    const ent = req.ent;
    const pwd = ent.pwd;
    const stuno = req.params.stuno;
    if(!pwd) {
        res.json(obj(400, '密码为空'));
        return;
    }
    njnuApi.checkStudent(stuno, pwd.trim())
        .then(checked =>
            checked ? faceImportDB.select(stuno).then(x => obj(200, x))
                : obj(500, '密码错误')
        )
        .catch(err => obj(502, err.message))
        .then(x => res.json(x));
})


get.use(utils.adminCheckMiddleware);

get.get('/face-import/admin/:stuno', (req, res) => {
    const stuno = req.params.stuno;
    faceImportDB.select(stuno).then(x => obj(200, x))
    .catch(err => obj(502, err.message))
    .then(x => res.json(x));
})

get.get('/stu-info/admin/:stuno', (req, res) => {
    const stuno = req.params.stuno;
    njnuApi.stuInfoByIdno(stuno)
        .then(info => info?obj(200, info): obj(400, '学号不存在'))
        .catch(err => obj(502, err.stack))
        .then(x => res.json(x))
})


module.exports = get
