/**
 * Created by moyu on 2017/5/20.
 */
const path = require('path');
const fs = require('fs');
const yaml = require('json2yaml');
const cv = require('../opencv');


const readImage = function (p) {
    return new Promise((resolve, reject) => {
        cv.readImage(p, (err, im) => {
            if (err) {
                reject(err);
            } else {
                resolve(im);
            }
        })
    })
};

const detectObject = (img_gray, classifier, options) =>
    new Promise((resolve, reject) => {
        img_gray.detectObject(classifier, options, (err, faces) => {
            if (err) {
                reject(err);
            } else {
                resolve(faces);
            }
        })
    });

const IMG_PATH = path.join(__dirname, '../../gp-image-download/images/2013/191301/');

let xmls = ['haarcascade_frontalface_alt.xml', 'haarcascade_frontalface_alt2.xml', 'haarcascade_frontalface_alt_tree.xml', 'haarcascade_frontalface_default.xml', 'lbpcascade_frontalface.xml'];
xmls = xmls.map(x => path.join(__dirname, '../data', x));

const imgs = fs.readdirSync(IMG_PATH).filter(x => !x.startsWith('.')).map(x => path.join(IMG_PATH, x));

const DB_PATH = path.join(__dirname, '../data/summary.json');
let db = {};
// if (fs.existsSync(DB_PATH)) {
//     db = require(DB_PATH);
// }

const obj2Str = (obj) => Object.keys(obj).map(k => k + ":" + obj[k]).join('-');
const argsList = [{scale: 1.1, neighbors: 3}, {scale: 1.84, neighbors: 3}, {scale: 1.1, neighbors: 4}]
db['total'] = imgs.length;

Promise
    .all(imgs.map(readImage))
    .then(imList =>
        Promise.all(
            imList.map(im => {
                let img_gray = im.copy();
                img_gray.toThree();
                img_gray.convertGrayscale();

                return Promise.all(
                    argsList.map(args =>
                        Promise.all(xmls.map(xml => detectObject(img_gray, xml, args).then(faces => ({faces, xml: path.basename(xml)}))))
                            .then(facesList => {
                                facesList.forEach(o => {
                                    db[o.xml] = db[o.xml] || {};
                                    let argStr = obj2Str(args)
                                    db[o.xml][argStr] = db[o.xml][argStr] || {};
                                    db[o.xml][argStr][o.faces.length] = db[o.xml][argStr][o.faces.length] || 0;
                                    db[o.xml][argStr][o.faces.length]++;
                                })
                            })
                    )
                )
            })
        )
    )
    .then(x => {
        console.log(db);
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    })
    .catch(console.error);


