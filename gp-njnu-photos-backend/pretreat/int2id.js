/**
 * Created by moyu on 2017/1/17.
 */
var path = require('path')
var fs = require('fs')

var filepath = path.resolve(__dirname, '..', 'data', 'int2id.json')
var data = fs.existsSync(filepath) ? require(filepath) : {}

const save = () => fs.readFileSync(filepath, JSON.stringify(data));

module.exports = {
    add() {}
}