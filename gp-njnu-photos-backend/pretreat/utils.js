const path = require('path')
const fs = require('fs')

module.exports = {
    dirs_walk: function dirs_walk(p, i, arr, l=2) {
        if(i==l) {arr.push(p); return arr;}
        if(fs.statSync(p).isDirectory()) {
            fs.readdirSync(p).forEach(x=>{
                x = path.join(p, x);
                dirs_walk(x, i+1, arr, l);
            })
        }
        return arr;
    },
    dest_path: path.resolve(__dirname, '../data/images'),
    mkdir: (path) => !fs.existsSync(path) && fs.mkdir(path),
    touch: (path) => !fs.existsSync(path) && fs.closeSync(fs.openSync(path, 'w')),
    decoName: (name) => {
        return {
            year: '20' + name.substr(2, 2),
            class: name.substr(0, 6)
        }
    },
    getFaceDetectArgs () {
        // path.resolve(__dirname, '../data/lbpcascade_frontalface.xml'), {scale: 1.95},
        return [path.resolve(__dirname, '../data/lbpcascade_frontalface.xml'), {}]
    },
    getURLData (url) {
        return new Promise((resovle, reject)=>{
            var parsed = require('url').parse(url)
            var protocol = parsed.protocol === 'http:' ? require('http'): require('https');
            protocol.get(url, (res) => {
                var chunks = []
                res.on('data', chunk => chunks.push(chunk))
                res.on('end', () => resovle(Buffer.concat(chunks)))
                res.on('error', err => reject(err))
            })
        })
    }
}
