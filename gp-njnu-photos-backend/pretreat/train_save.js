/**
 * Created by moyu on 16/12/17.
 */
const cv = require('../opencv')
const path = require('path')
const dirs_walk = require('./utils').dirs_walk
const utils = require('./utils');
const getFaceDetectArgs = require('./utils').getFaceDetectArgs;
const WIDTH = require('./utils').WIDTH;
const HEIGHT = require('./utils').HEIGHT;
const img_path = require('./utils').dest_path
const face_path = path.resolve(img_path, '..', 'face-recognizer')
const mkdir = require('./utils').mkdir
const fs = require('fs')

const md5Hex = require('../lib/utils').md5Hex;

mkdir(face_path)

const getJpgFiles = (n) => fs.readdirSync(n).filter(x=>x.endsWith('jpg')).map(x=>path.join(n, x))

const bFocus = process.argv.indexOf('-f')!==-1
const iArgs = process.argv.indexOf('--args')
let gClassno = null, gYear = null;
if(iArgs>=0) {
    gClassno = process.argv[iArgs+2];
    gYear = process.argv[iArgs+1];
}

const readImagePromise = (buf) => {
    return new Promise((resolve, reject)=> {
        cv.readImage(buf, (err, mat) => {
            if(err) reject(err);
            else resolve(mat);
        })
    })
}

if(fs.existsSync(face_path+'.json') && !bFocus) {
    var files_obj = require(face_path+'.json');
    console.log('Read %s', face_path+'.json')
} else {

    var dir_arr = dirs_walk(img_path, 0, [], 2)
    var files_obj = dir_arr.reduce((p, n) => {
        let year = path.basename(path.dirname(n)),
            classno = path.basename(n)
        if(classno.startsWith('.')) {
            return p;
        }

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

var facesNumObj = {}
var facesNumObjPath = path.resolve(face_path, 'facesNumObj.json')

const train_save = (year, classno, focus, idno) => {
    let fr = cv.FaceRecognizer.createEigenFaceRecognizer();
    let fpath = path.join(face_path, `${year}-${classno}.yaml`);

    var select = require('../database/face-import').select;
    var promise = null;
    facesNumObj[year] = facesNumObj[year] || {}
    facesNumObj[year][classno] = facesNumObj[year][classno] || {}
    var idNumMap = facesNumObj[year][classno]

    if( (focus || !fs.existsSync(fpath)) ) {
        if (files_obj[year][classno]) {
            promise = files_obj[year][classno].reduce((p, n)=> {
                var id = path.basename(n).replace(/\..*$/, '');
                var no = 0;
                var label = parseInt(++no + id);
                idNumMap[id] = 1;
                return p.then(arr=>{arr.push([label, n]); return arr})
                    .then(arr=>{
                        return select(id).then(list=>list.map(l=>utils.getURLData(l.face_url)
                            .then(buf=>readImagePromise(buf))
                        ))
                            .then(x=>Promise.all(x))
                            .then(bufs => {
                                bufs.forEach(buf => {
                                    label = parseInt(++no + id);
                                    arr.push([label, buf]);
                                })
                                idNumMap[id]+=bufs.length;
                                return arr;
                            })
                    })
            }, Promise.resolve([]))
        } else if(idno) {
            promise = select(idno)
                .then(list=>list.map(l=>utils.getURLData(l.face_url).then(buf=>readImagePromise(buf))))
                .then(x=>Promise.all(x))
                .then(bufs => {
                    var no = 0;
                    var arr = bufs.map(buf => {
                        var label = parseInt(++no + idno);
                        return [label, buf];
                    });
                    idNumMap[idno] = bufs.length;
                    return arr;
                })
        }
    } else {
        promise = Promise.resolve(null);
    }

    return promise.then(data => {
        if(data) {
            if (data.length === 0) {
                return null;
            }
            console.log('Save Train Data %s', fpath)
            fr.trainSync(data);
            fr.saveSync(fpath);
            fs.writeFileSync(facesNumObjPath, JSON.stringify(facesNumObj));
        } else {
            console.log('Read Train Data %s', fpath)
            fr.loadSync(fpath);
            if (fs.existsSync(facesNumObjPath)) {
                facesNumObj = JSON.parse(fs.readFileSync(facesNumObjPath));
            }
        }

        return fr;
    })
}

const each = (obj, fn) => Object.keys(obj).forEach((x, i)=>fn && fn(obj[x], x, i))

const memDATA = {};

each(files_obj, (o, year, i)=> {
    memDATA[year] = memDATA[year] || {}
    each(o, (arr, classno, i) => {
        if(process.env.NODE_ENV == 'dev') {
            if (year == 2013 && classno == 191301)
                train_save(year, classno, bFocus).then(fr => memDATA[year][classno] = fr)
        } else {
            if (gYear) {
                if(gYear == year) {
                    if(gClassno) {
                        if (gClassno == classno)
                            train_save(year, classno, bFocus).then(fr => memDATA[year][classno] = fr)
                    } else
                        train_save(year, classno, bFocus).then(fr => memDATA[year][classno] = fr)
                }
            } else
                train_save(year, classno, bFocus).then(fr => memDATA[year][classno] = fr)
        }
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
    pretreat: (im, cb, mock=false) => {
        var img_gray = im.copy();
        img_gray.toThree();
        img_gray.convertGrayscale();
        var args = getFaceDetectArgs();
        img_gray.detectObject(args[0], args[1],
            (err, faces) => {
                if(err) {
                    cb && cb(err); return;
                }
                var face = faces[0]
                if(face) {
                    try {
                        if(face.width !== WIDTH || face.height !== HEIGHT) {
                            img_gray = img_gray.crop(face.x, face.y, face.width, face.height);
                            img_gray.resize(WIDTH, HEIGHT);
                        } else{
                            img_gray = img_gray.crop(face.x, face.y, face.width, face.height);
                        }
                    } catch (ex) {
                        cb && cb(ex);
                        return;
                    }
                    cb && cb(null, img_gray)
                } else {
                    if (mock) {
                        img_gray.resize(WIDTH, HEIGHT)
                        cb && cb(null, img_gray)
                    } else {
                        cb && cb(new Error('未识别到人脸'))
                    }
                }

            }
        )
    },
    faceRecImageBuffer: (buf) => {
        return new Promise((ok, fail) => {
            readImageThunk(buf)((err, im) => {
                if (err) fail(err);
                else {
                    out.pretreat(im, (err, matrix) => {
                        if (err) fail(err);
                        else
                            matrix.toBuffer((err, buf) => {
                                if(err) fail(err);
                                else ok(buf);
                            })
                    })
                }
            })
        })
    },
    predict(classno, buffer) {
        return new Promise((resolve, reject) => {
            var year = '20'+(''+classno).substr(2, 2);
            if(memDATA[year] && memDATA[year][classno]) {
                readImageThunk(buffer)((err, mat) => {
                    if(err) reject(err);
                    else {
                        this.pretreat(mat, (err, treated) => {
                            if(err) reject(err);
                            else {
                                memDATA[year][classno].predict(treated, (obj)=>{
                                    obj.id = (obj.id+'').slice(1);
                                    // http://stackoverflow.com/questions/13652778/what-is-confidence-in-opencvs-facerecognizer
                                    var nTrainFaces = facesNumObj[year][classno][obj.id];
                                    // var total = 0;
                                    // each(facesNumObj[year][classno], (obj, key ,i) => {
                                    //     total += obj;
                                    // })
                                    // obj.distance = obj.confidence;
                                    // obj.confidence = 100 * (1 - Math.sqrt( obj.confidence / (total * total) ) / 255) + '%';
                                    if(obj.confidence<2700) {
                                        resolve(obj.id);
                                    } else {
                                        reject(new Error('对不起，我们认为你不是本班学生，你可以进行人脸录入, confidence='+obj.confidence+', label='+obj.id));
                                    }
                                    
                                })
                            }
                        })
                    }
                })
            } else {
                console.error('Not Found, year: %s, classno: %s', year, classno)
                reject(new Error('没有找到班级：'+ classno));
            }
        })
    },

    reTrain (idno) {
        var year = '20'+idno.substr(2, 2);
        var cls = idno.substr(0, 6);
        memDATA[year] = memDATA[year] || {}
        train_save(year, cls, true, idno).then(fr => memDATA[year][cls] = fr)
    },

    isTrained(idno) {
        var y = '20'+idno.substr(2, 2);
        var cls = idno.substr(0, 6);
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
