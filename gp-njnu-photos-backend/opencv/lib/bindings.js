// var binary = require('node-pre-gyp');
// var path = require('path');
// var binding_path = binary.find(path.resolve(path.join(__dirname,'../package.json')), { debug: !!process.env.DEBUG });
// var binding = require(binding_path);
//
// var ctcp =


//module.exports = require('../build/Release/opencv.node');
module.exports = require('bindings')('opencv');
