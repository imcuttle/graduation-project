
var cp = require('child_process')
var p = require('path')
var fs = require('fs')

fs.watch(__dirname, (type, filename) => {
    if(!filename.endsWith(".js")) {
        return;
    }
    serverProcess.kill('SIGINT')
    serverProcess = runServer()
})

var serverProcess = runServer()

function runServer() {
    return cp.fork('./index.js', process.argv, {stdio: [0, 1, 2, 'ipc']})
}