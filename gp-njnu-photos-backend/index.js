const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const url = require('url')
const path = require('path')
// require.extensions['.less'] = () => {return {}};
// console.log(process.NODE_ENV)

/*require("babel-core/register")({
    presets: [[require('babel-preset-es2015').buildPreset, {loose: true}], 'stage-0', 'react'],
    // ignore: /components\/index\.less$/,
    // ignore: function (name) {
    //     name = name.trim();
    //     console.log(name, name.indexOf('node_modules')>=0 || name.endsWith('less'));
    //     return name.indexOf('node_modules')>=0 || name.endsWith('less') || 
    // },
    extensions: [".es6", ".es", ".jsx", ".js", ".less"],


    only: /(gp-njnu-photos-app\/app\/components\/.*?\/.*.jsx?)|(gp-njnu-photos-app\/app\/router)|(gp-njnu-photos-app\/app\/App)|(react-server)/
})*/


// var reactServer = require('./routes/react-server')

const utils = require('./lib/utils');

process.env.PORT = process.env.PORT || 8778;

process.on('uncaughtException', function (err) {
    console.error(err);
    console.error(err.stack);
});
const app = express()

// app.use('/', reactServer)
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.raw({limit:'5mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit:'5mb'}));
app.use(logger('dev'));

process.on('uncaughtException', console.error)

app.use((req, res, next) => {
    let ent;
    if(req.method==='POST') {
        ent = req.body
    } else {
        ent = req.query
    }
    req.ent = ent;
    next()
});


global.seqes = [utils.md5Hex(JSON.stringify({user: 'moyuyc', pwd: 'moyuyc'})), utils.md5Hex(JSON.stringify({pwd: 'moyuyc', user: 'moyuyc'}))]

const fePath = path.resolve(__dirname, '..', 'gp-njnu-photos-app', 'build')

app.all('*', (req, res, next) => {
    var baseUrl = require('url').parse(req.originalUrl).pathname;
    console.log(baseUrl)
    if(baseUrl === '/' || baseUrl === '/face-import'
         || baseUrl === '/admin' || baseUrl === '/admin/login' || baseUrl === '/about') {
        res.sendFile(fePath+'/index.html');
    } else {
        if(require('fs').existsSync(fePath+baseUrl)) {
            res.sendFile(fePath+baseUrl);
        } else 
            next();
        // res.status(404).json({code: 404, result: 'Not Found'})
    }
})

app.all('/api', (req, res) => {
    res.end('By Moyu.');
})

app.use('/api/up', require('./routes/up'))
app.use('/api/ctrl', require('./routes/control'))
app.use('/api/get', require('./routes/get'))
app.use('/api/do', require('./routes/do'))
app.use('/api/njnu', require('./routes/njnu'))

app.listen(process.env.PORT, () => console.log("Server Run On http://localhost:%s", process.env.PORT))
