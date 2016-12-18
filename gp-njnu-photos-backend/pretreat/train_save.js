/**
 * Created by moyu on 16/12/17.
 */
const cv = require('../opencv')
const path = require('path')
const dirs_walk = require('./utils').dirs_walk
const img_path = require('./utils').dest_path
const face_path = path.resolve(img_path, '..', 'face-recognizer')
const mkdir = require('./utils').mkdir
const fs = require('fs')
mkdir(face_path)

const getJpgFiles = (n) => fs.readdirSync(n).filter(x=>x.endsWith('jpg')).map(x=>path.join(n, x))

const bFocus = process.argv.indexOf('-f')!==-1


if(fs.existsSync(face_path+'.json') && !bFocus) {
    var files_obj = require(face_path+'.json');
    console.log('Read %s', face_path+'.json')
} else {

    var dir_arr = dirs_walk(img_path, 0, [], 2)
    var files_obj = dir_arr.reduce((p, n) => {
        let year = path.basename(path.dirname(n)),
            classno = path.basename(n)

        p[year] = p[year] || {}
        p[year][classno] = getJpgFiles(n)
        return p
    }, {})

    fs.writeFileSync(face_path+'.json', JSON.stringify(files_obj, null, 4))
    console.log("All Sample Faces' Absolute Path Saved on %s", face_path+'.json')
}


const checkSizeEqueal = obj => obj.forEach(x=>{
    cv.readImage(x, (err, im) => {
        if(err) throw err;
        console.log('name: %s, width: %d, height: %d, channels: %d', x, im.width(), im.height(), im.channels())
    })
})


// checkSizeEqueal(files_obj['2013']['191301']);

const train_save = (year, classno, focus) => {
    let fr = cv.FaceRecognizer.createEigenFaceRecognizer()
    try {
        fr.trainSync(
            files_obj[year][classno].map(x=> [
                parseInt(path.basename(x).replace(/\..*$/, '')),
                x
            ])
        )
        let fpath = path.join(face_path, `${year}-${classno}.yaml`);
        if(focus || !fs.existsSync(fpath)) {
            fr.saveSync(fpath);
            console.log('Saved Train Data %s', fpath)
        } else {
            fr.loadSync(fpath);
            console.log('Read Train Data %s', fpath)
        }
    } catch (ex) {
        console.error('year: %s, class: %s\n', year, classno, ex);
    }
    return fr;
}

const each = (obj, fn) => Object.keys(obj).forEach((x, i)=>fn && fn(obj[x], x, i))

const memDATA = {}

each(files_obj, (o, year, i)=> {
    memDATA[year] = memDATA[year] || {}
    each(o, (arr, classno, i) => {
        memDATA[year][classno] = train_save(year, classno, bFocus)
    })
})

moudule.exports = {
    predict: (classno, buffer) =>
        new Promise((resolve, reject) => {
            var year = '20'+classno.substr(2, 2)
            if(memDATA[year] && memDATA[year][classno]) {
                cv.readImage(buffer, (err, mat) => {
                    if(err) reject(err);
                    memDATA[year][classno].predict(mat, (err, label)=>{
                        if(err) reject(err);
                        resolve(label)
                    })
                })
            } else {
                console.error('Not Found, year: %s, classno: %s', year, classno)
                reject(new Error('Not Found, year: %s, classno: %s', year, classno));
            }
        }),
    isTrained(idno) {
        var y = '20'+idno.substr(2, 2)
        var cls = idno.substr(0, 6)
        if(files_obj[y] && files_obj[y][cls]) {
            return files_obj[y][cls].findIndex(x=>path.basename(x).replace(/\..*$/, '')==idno)>=0
        }
        return false
    }
}
