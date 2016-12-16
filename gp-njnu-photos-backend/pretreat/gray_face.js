/**
 * Created by moyu on 16/12/16.
 */
const cv = require('opencv')
const path = require('path')
const fs = require('fs')

// const img_src_path = '../../gp-image-download/images/2013/191301'
const img_dest_path = '../data/images'

const mkdir = (path) => !fs.existsSync(path) && fs.mkdir(path)
const touch = (path) => !fs.existsSync(path) && fs.closeSync(fs.openSync(path, 'w'));

const decoName = (name) => {
    return {
        year: '20' + name.substr(2, 2),
        class: name.substr(0, 6)
    }
}

// (B)lue, (G)reen, (R)ed
/*
const data_path = '../data/summary.json'
touch(data_path)
const data = JSON.parse(fs.readFileSync(data_path).toString() || "{}");
['../../gp-image-download/images/2013/191301', '../../gp-image-download/images/2013/191302', '../../gp-image-download/images/2013/191303']
    .forEach(_p=>{
        [
            '/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/data/lbpcascade_frontalface.xml',
            // '/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/data/haarcascade_frontalface_alt.xml',
            // '/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/data/haarcascade_frontalface_alt2.xml',
            // '/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/data/haarcascade_frontalface_alt_tree.xml',
            // '/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/data/haarcascade_frontalface_default.xml'
        ].forEach(classf => {
            var opts = {scale: 1.2}
            var _b = path.basename(classf)
            data[_b] = data[_b] || {}
            data[_b][JSON.stringify(opts)] = data[_b][JSON.stringify(opts)] || {}
            var v = data[_b][JSON.stringify(opts)]
            _b = path.basename(_p)
            var o = decoName(_b)
            o = o.year+'/'+o.class
            v[o] = v[o] || {}
            v = v[o]
            doClassFace(_p, classf, opts,
                (faces, name, index, length) => {
                    var s = faces.length;
                    v[s] = v[s] || []
                    v[s].push(name)
                    v.size = length
                    if(index === length-1) {
                        fs.writeFileSync(data_path, JSON.stringify(data, null, 4))
                    }
                }, true
            )
        })
    })*/


doClassFace('../../gp-image-download/images/2013/191302',
    '/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/data/lbpcascade_frontalface.xml',
    {scale: 1.95}, null, true
)

function doClassFace (img_src_path, classifier, options, fn, save) {
    const files = fs.readdirSync(img_src_path)
    mkdir(img_dest_path)

    files.filter(x=>x.endsWith('jpg')).forEach((name, index) => {
        const obj = decoName(name)
        if(obj) {
            var d_p = path.join(img_dest_path, obj.year),
                s_p = path.join(img_src_path, name)
            mkdir(d_p)
            d_p = path.join(d_p, obj.class)
            mkdir(d_p)
            d_p = path.join(d_p, path.basename(classifier).replace(/\..*$/, ''))
            mkdir(d_p)
            d_p = path.join(d_p, 'opts'+JSON.stringify(options))
            mkdir(d_p)
            cv.readImage(s_p, (err, im) => {
                if(err) throw err;
                const img_gray = im.copy()

                // img_gray.inRange(lower_threshold, upper_threshold)
                // img_gray.convertGrayscale()

                img_gray.detectObject(classifier,
                    options,
                    (err, faces) => {
                        if(err) throw err;
                        var face = faces[0] || {x:0 , y:0, width: img_gray.width(), height: img_gray.height()}
                        // faces.forEach(face=>{
                        //     img_gray.rectangle([face.x, face.y], [face.width, face.height], [0, 255, 0], 2);
                        // })
                        img_gray.crop(face.x, face.y, face.width, face.height).save(path.join(d_p, name));
                        // save && img_gray.save(path.join(d_p, name));
                        fn && fn(faces, name, index, files.length)
                    })

                // img_gray.save(path.join(d_p, name))
            })
        }
    })
}



