
const express = require('express')
const up = express()
const p = require('path')

const utils = require('../utils')
const obj = utils.obj


up.post('/student/base64', (req, res) => {
	const ent = req.ent
	const data = ent.data
	const rlt = utils.decodeBase64Image(data);
	if(rlt.data > 1024*1024*2) {
		res.json(obj(400, "图片太大了!"))
	} else {
		// todo
		res.json(obj(200, "成功"))
	}
})

module.exports = up