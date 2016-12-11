/**
 * Created by Yc on 2016/12/11.
 */

const fs = require('fs')
const p = require('path')

const walk_file = (path) => {
    const basename = p.basename(path)
    const stat = fs.statSync(path);
    if(!stat.isFile()) {
        if(basename==='node_modules') {
            return;
        }
        const dirs = fs.readdirSync(path)
        dirs.forEach(x=>walk_file(p.join(path, x)))
    } else {
        const ext = p.extname(basename)
        if(ext==='.js' || ext === '.css' || ext==='.less' || ext==='.sh') {
            update_indent_file(path)
        }
    }
}

const update_indent_file = (path) => {
    console.log('update_indent_file', path)
    const old = fs.readFileSync(path).toString()
    fs.writeFileSync(path, old.replace(/\t/g, '    '))
}

walk_file(__dirname)