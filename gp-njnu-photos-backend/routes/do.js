
const express = require('express')
const doServer = express()
const p = require('path')

const utils = require('../lib/utils')
const njnuApi = require('../lib/njnu')
const train = require('../pretreat/train_save')
const faceImportDB = require('../database/face-import')

const obj = utils.obj


doServer.post('/face-import/delete', (req, res) => {
    const ent = req.ent;
    const pwd = ent.pwd, stuno = ent.stuno, hash = ent.hash;
    if(!pwd || !stuno || !hash) {
        res.json(obj(400, '参数不全'));
        return;
    }
    njnuApi.checkStudent(stuno, pwd.trim())
        .then(checked =>
            checked ? faceImportDB.delete(hash, stuno).then(x => x ? obj(200, '删除成功'): obj(500, '删除失败'))
                : obj(500, '密码错误')
        )
        .catch(err => obj(502, err.message))
        .then(x => res.json(x));
})

doServer.post('/admin/login', (req, res) => {
    const ent = req.ent;
    const pwd = ent.pwd, user = ent.user;
    if(!pwd || !user) {
        res.json(obj(400, '参数不全'));
        return;
    }
    if(pwd.trim() === 'moyuyc' && user.trim() === 'moyuyc') {
        res.json(obj(200, '登录成功'));
    } else {
        res.json(obj(500, '帐号或密码不正确'));
    }
})



module.exports = doServer
