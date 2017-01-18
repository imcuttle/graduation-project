//control.js

const express = require('express')
const ctrl = express()
const p = require('path')

const utils = require('../lib/utils')
const njnuApi = require('../lib/njnu')
const train = require('../pretreat/train_save')

ctrl.all('/pull', (req, res) => {
    // req.socket.setTimeout(Infinity);
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    var ls = require('child_process').spawn('git', ['pull', 'origin', 'master'])
    ls.stdout.on('data', (data) => {
        data = data.toString()
        console.log(data)
        res.write(`${data}`);
    });

    ls.stderr.on('data', (data) => {
        data = data.toString()
        console.log(data)
        res.write(`${data}`);
    });
    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`)
        res.end(`child process exited with code ${code}`);
    });

})

ctrl.all('/cwd', (req, res) => {
    res.end(process.cwd());
})

ctrl.all('/npmi', (req, res) => {
    // req.socket.setTimeout(Infinity);
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    var ls = require('child_process').spawn('npm', ['install'])
    ls.stdout.on('data', (data) => {
        data = data.toString()
        console.log(data)
        res.write(`${data}`);
    });

    ls.stderr.on('data', (data) => {
        data = data.toString()
        console.log(data)
        res.write(`${data}`);
    });
    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`)
        res.end(`child process exited with code ${code}`);
    });

})

module.exports = ctrl;
