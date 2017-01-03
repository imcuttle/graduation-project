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

const md5Hex = require('md5-hex');

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
        // dev mode
        if(year == 2013 && classno == 191301)
            memDATA[year][classno] = train_save(year, classno, bFocus)
    })
})

save._updated = false;
function save () {
    fs.writeFileSync(face_path+'.json', JSON.stringify(files_obj, null, 4))
}

const readImageThunk = (buf) => {
    return cv.readImage.bind(cv, buf)
}

var out = {
    pretreat: (im, cb) => {
        var img_gray = im.clone();
        img_gray.toThree();
        img_gray.convertGrayscale();
        img_gray.detectObject(
            path.resolve(__dirname, '../data/lbpcascade_frontalface.xml'), {scale: 1.95},
            (err, faces) => {
                if(err) {
                    cb && cb(err); return;
                }
                var face = faces[0]

                if(face){
                    if(face.width !== 91 || face.height !== 91) {
                        img_gray = img_gray.crop(face.x, face.y, face.width, face.height);
                        img_gray.resize(91, 91);
                    } else{
                        img_gray = img_gray.crop(face.x, face.y, face.width, face.height);
                    }
                    cb && cb(null, img_gray)
                } else {
                    img_gray.resize(91, 91)
                    cb && cb(null, img_gray)
                }

            }
        )
    },
    predict(classno, buffer) {
        return new Promise((resolve, reject) => {
            var year = '20'+(''+classno).substr(2, 2)
            if(memDATA[year] && memDATA[year][classno]) {
                readImageThunk(buffer)((err, mat) => {
                    if(err) reject(err);
                    else {
                        this.pretreat(mat, (err, treated) => {
                            if(err) reject(err);
                            else {
                                // treated.save(Date.now()+'.jpg')
                                memDATA[year][classno].predict(treated, (obj)=>{
                                    resolve(obj)
                                })
                            }
                        })
                    }
                })
            } else {
                console.error('Not Found, year: %s, classno: %s', year, classno)
                reject(new Error('Not Found, classno: '+ classno));
            }
        })
    },
    isTrained(idno) {
        var y = '20'+idno.substr(2, 2)
        var cls = idno.substr(0, 6)
        if(files_obj[y] && files_obj[y][cls]) {
            return files_obj[y][cls].findIndex(x=>path.basename(x).replace(/\..*$/, '')==idno)>=0
        }
        return false
    },
    addFace(stuno, buffer) {
        return new Promise((resolve, reject) => {
            readImageThunk(buffer)((err, mat) => {
                if(err) reject(err);
                else {
                    this.pretreat(mat, (err, im) => {
                        if(err) reject(err);
                        else {
                            let md5 = md5Hex(buffer);
                            let obj = utils.decoName(stuno);
                            let filepath = path.join(dest_path, obj.year, obj.classno, `${stuno}.${md5}.jpg`);
                            im.saveAsync(filepath, err => {
                                if(err) reject(err);
                                else {
                                    save._updated = true;
                                    files_obj[obj.year][obj.classno].push(filepath);
                                    // todo: mysql. insert
                                    resolve(md5);
                                }
                            })
                        }
                    })
                }
            })    
        })
    },
    delFace(stuno, md5) {
        return new Promise((resolve, reject) => {
            let obj = utils.decoName(stuno);
            let filepath = path.join(dest_path, obj.year, obj.classno, `${stuno}.${md5}.jpg`);
            // todo: mysql. delete where md5
            if(fs.existsSync(filepath)) {
                fs.unlink(filepath, err=> {
                    if(err) reject(err);
                    else {
                        save._updated = true;
                        let i = files_obj[obj.year][obj.classno].indexOf(filepath);
                        if(i>=0) {
                            files_obj[obj.year][obj.classno].splice(i, 1)
                        }
                        resolve();
                    }
                });
            } else {
                reject(new Error(filepath + 'Not Found.'));
            }
        })
    }
}

process.on('SIGINT', () => {
    process.exit(1)
})

process.on('exit', () => {
    if(save._updated) {
        save()
    }
})

module.exports = out
