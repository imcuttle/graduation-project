
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




module.exports = get
