
var cp = require('child_process')
var p = require('path')
var fs = require('fs')

const children = fs.readdirSync(__dirname).filter(n=>n!='node_modules' && !n.startsWith('.'));

[__dirname].concat(children).forEach(dir => fs.watch(dir, watchHandle))

function watchHandle (type, filename) {
    if(filename.startsWith('.') || !filename.endsWith(".js")) {
        return;
    }

    console.log(type, filename);
    serverProcess.kill('SIGINT');
    serverProcess = runServer();
}

var serverProcess = runServer();
/*process.on('exit', (code) => {
    serverProcess.kill('SIGINT');
    console.log(`About to exit with code: ${code}`);
});
process.on('SIGINT', () => {
    process.exit(0);
});*/


function runServer() {
    return cp.fork('./index.js', process.argv, {stdio: [0, 1, 2, 'ipc']})
}