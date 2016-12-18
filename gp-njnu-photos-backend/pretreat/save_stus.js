/**
 * Created by moyu on 16/12/18.
 */
const dirs_walk = require('./utils').dirs_walk
const path = require('path')
const fs = require('fs')

let src_path = path.resolve(__dirname, '../../gp-image-download/images')

const getIds = (n) => fs.readdirSync(n).filter(x=>x.endsWith('jpg')).map(x=>x.replace(/\.jpg$/, ''))

var files_obj = dirs_walk(src_path, 0, [], 2).reduce((p, n) => {
    let year = path.basename(path.dirname(n)),
        classno = path.basename(n)

    p[year] = p[year] || {}
    p[year][classno] = getIds(n)
    return p
}, {})

var ps =  path.resolve(__dirname, '..', 'data', 'students.json')
fs.writeFileSync(ps, JSON.stringify(files_obj, null, 2));
console.log('Saved. %s', ps)
