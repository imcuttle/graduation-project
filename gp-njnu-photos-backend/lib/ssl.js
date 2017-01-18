var path = require('path');

var keyPath = path.join(__dirname, '../ssl/moyukey.pem');
var certPath = path.join(__dirname, '../ssl/moyucert.pem');
var fs = require('fs')

var hskey = fs.readFileSync(keyPath);
var hscert = fs.readFileSync(certPath);


module.exports = {
    key: hskey,
    cert: hscert
};


