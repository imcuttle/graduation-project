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
    touch: (path) => !fs.existsSync(path) && fs.closeSync(fs.openSync(path, 'w'))
}
