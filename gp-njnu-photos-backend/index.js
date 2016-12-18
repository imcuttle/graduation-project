const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const url = require('url')
const path = require('path')

process.env.PORT = process.env.PORT || 8778;

process.on('uncaughtException', function (err) {
    console.error(err);
    console.error(err.stack);
});

const app = express()

app.use('/', express.static(__dirname + '/publish'))
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.raw({limit:'5mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit:'5mb'}));
app.use(logger('dev'));

app.use((req, res, next) => {
    let ent;
    if(req.method==='POST') {
        ent = req.body
    } else {
        ent = req.query
    }
    req.ent = ent;
    next()
})

app.all('/api', (req, res) => {
    res.end('By Moyu.');
})

app.use('/api/up', require('./routes/up'))
app.use('/api/njnu', require('./routes/njnu'))

app.listen(process.env.PORT, () => console.log("Server Run On http://localhost:%s", process.env.PORT))
