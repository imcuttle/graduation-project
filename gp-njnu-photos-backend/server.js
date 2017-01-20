require("babel-core/register")

const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const url = require('url')
const session = require('express-session');
const path = require('path')
var cookieParser = require('cookie-parser');
process.env.PORT = process.env.PORT || 8778;

var reactServer = require('./routes/react-server')
const utils = require('./lib/utils');
// const proto = require('http')
// const ssl = require('./lib/ssl')

process.on('uncaughtException', function (err) {
    console.error(err);
    console.error(err.stack);
});
const app = express();
// app.use(cookieParser());
// process.env.DEBUG = "express-session";
app.use(session({
    // resave: true,
    // saveUninitialized: true,
    cookie: { maxAge: 1000*60*60*24 },
    secret: 'face-njnu',
    // store: 'MemStore'
}));
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

// app.all('*', (req, res, next) => {
//     var baseUrl = require('url').parse(req.originalUrl).pathname;
//     console.log(baseUrl)
//     if(baseUrl === '/' || baseUrl === '/face-import'
//          || baseUrl === '/admin' || baseUrl === '/admin/login' || baseUrl === '/about') {
//         res.sendFile(fePath+'/index.html');
//     } else {
//         if(require('fs').existsSync(fePath+baseUrl)) {
//             res.sendFile(fePath+baseUrl);
//         } else
//             next();
//         // res.status(404).json({code: 404, result: 'Not Found'})
//     }
// })
app.use((req, res, next) => {
    console.log('session', req.session.id);
    next();
})
app.use('/', reactServer);
app.use('/', express.static(fePath))
app.all('/api', (req, res) => {
    res.end('By Moyu.');
})
app.use('/api/up', require('./routes/up'))
app.use('/api/ctrl', require('./routes/control'))
app.use('/api/get', require('./routes/get'))
app.use('/api/do', require('./routes/do'))
app.use('/api/njnu', require('./routes/njnu'))

app.listen(process.env.PORT, () => console.log("Server Run On http://localhost:%s", process.env.PORT));