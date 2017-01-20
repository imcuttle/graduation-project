
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
            checked ? faceImportDB.delete(hash, stuno).then(x => {
                    if (x) {
                        train.reTrain(stuno.trim());
                        return obj(200, '删除成功');
                    } else {
                        return obj(500, '删除失败');
                    }
                })
                : obj(500, '密码错误')
        )
        .catch(err => obj(502, err.message))
        .then(x => res.json(x));
})

doServer.post('/admin/logout', (req, res) => {
    const ent = req.ent;
    // const data = ent.data;
    req.session.isAdmin = false;
    res.json(obj(200, '登出成功'));
})

doServer.use(utils.adminCheckMiddleware)

doServer.post('/admin/getname', (req, res) => {
    const ent = req.ent;
    const data = ent.data;
    res.json(obj(200, 'moyuyc'));
})


doServer.post('/admin/login', (req, res) => {
    const ent = req.ent;
    const data = ent.data;
    res.json(obj(200, '登录成功'));
})

doServer.post('/admin/del-face/:hash', (req, res) => {
    const hash = req.params.hash;
    faceImportDB.selectByHash(hash)
        .then(data => data && train.reTrain(data.stuid))
        .then(()=> {
            faceImportDB.deleteByHash(hash)
            .then(flag => flag ? obj(200, '删除成功') : obj(500, '删除失败'))
            .catch(err => obj(502, err.message))
            .then(x => res.json(x))
        })
})



module.exports = doServer
