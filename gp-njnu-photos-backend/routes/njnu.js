
const express = require('express')
const njnu = express()
const p = require('path')

const njnuApi = require('../lib/njnu')
const utils = require('../lib/utils')
const obj = utils.obj


njnu.get('/info', (req, res) => {
    const ent = req.ent
    const id = ent.id, pwd = ent.pwd
    
    if(!id || !pwd) {
        res.json(obj(400, "学号密码都需要"))
    } else {
        njnuApi.getStudentInfo(id.trim(), pwd.trim())
        .then(info=>info?obj(200, info):obj(400, "学号或者密码错误"), ex=>obj(500, ex.message))
        .then(o=>res.json(o))
    }
})

njnu.get('/rec', (req, res) => {
    const ent = req.ent
    const id = ent.data, pwd = ent.pwd
})

module.exports = njnu
