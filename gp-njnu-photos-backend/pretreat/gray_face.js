/**
 * Created by moyu on 16/12/16.
 */
const cv = require('../opencv')
const path = require('path')
const fs = require('fs')

// const img_src_path = '../../gp-image-download/images/2013/191301'
const img_dest_path = require('./utils').dest_path
const getPreTreatFaceDetectArgs = require('./utils').getPreTreatFaceDetectArgs
const dirs_walk = require('./utils').dirs_walk
const mkdir = require('./utils').mkdir
const touch = require('./utils').touch



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

let sub_path = '2013/191301';
let src_path = path.resolve(__dirname, '../../gp-image-download/images')

if(process.argv.length>2) {
    let args = process.argv.slice(2)
    sub_path = args.join('/')
    if(args.length==1) {
        dirs_walk(path.join(src_path, sub_path), 0, [], 1).forEach(action)
    } else {
        action(path.join(src_path, sub_path))
    }
} else {
    dirs_walk(src_path, 0, [], 2).forEach(action)
}



function action(p) {
    doClassFace.apply(null, [p].concat(getPreTreatFaceDetectArgs()).concat([null, true, true]))
}



function doClassFace (img_src_path, classifier, options, fn, save, log) {
    if (path.basename(img_src_path).startsWith('.')) {
        return;
    }
    const files = fs.readdirSync(img_src_path)
    mkdir(img_dest_path)
    log && console.log(`Detect Face and Gray: ${img_src_path} => ${img_dest_path}`);

    files.filter(x=>x.endsWith('jpg')).forEach((name, index) => {
        const obj = decoName(name)
        if(obj) {
            var d_p = path.join(img_dest_path, obj.year),
                s_p = path.join(img_src_path, name)
            mkdir(d_p)
            d_p = path.join(d_p, obj.class)
            mkdir(d_p)
            // d_p = path.join(d_p, path.basename(classifier).replace(/\..*$/, ''))
            // mkdir(d_p)
            // d_p = path.join(d_p, 'opts'+JSON.stringify(options))
            // mkdir(d_p)
            cv.readImage(s_p, (err, im) => {
                if(err) throw err;
                let img_gray = im.copy()

                // img_gray.inRange(lower_threshold, upper_threshold)
                // img_gray.PCA()
                img_gray.toThree();
                img_gray.convertGrayscale()

                img_gray.detectObject(classifier,
                    options,
                    (err, faces) => {
                        if(err) throw err;
                        var face = faces[0]
                        // faces.forEach(face=>{
                        //     img_gray.rectangle([face.x, face.y], [face.width, face.height], [0, 255, 0], 2);
                        // })
                        if(face && (face.width !== 91 || face.height !== 91)) {
                            img_gray = img_gray.crop(face.x, face.y, face.width, face.height)
                            img_gray.resize(91, 91);
                            save && img_gray.save(path.join(d_p, name));
                        } else {
                            save && face && img_gray.crop(face.x, face.y, face.width, face.height)/*.rectLBP()*/.save(path.join(d_p, name));
                        }
                        // save && img_gray.save(path.join(d_p, name));
                        fn && fn(faces, name, index, files.length)
                    })

                // img_gray.save(path.join(d_p, name))
            })
        }
    })
}


// function lbp(src, dst, radius, neighbors) {
//     const sin = Math.sin, cos = Math.cos, floor = Math.floor, ceil = Math.ceil
//     for(let n=0; n<neighbors; n++) {
//         // 采样点的计算
//         let x = -radius * sin(2.0*CV_PI*n/static_cast<float>(neighbors)),
//             y = radius * cos(2.0*CV_PI*n/static_cast<float>(neighbors)),
//         // 上取整和下取整的值
//             fx = floor(x),
//             fy = floor(y),
//             cx = ceil(x),
//             cy = ceil(y),
//         // 小数部分
//             ty = y - fy,
//             tx = x - fx,
//         // 设置插值权重
//             w1 = (1 - tx) * (1 - ty),
//             w2 =      tx  * (1 - ty),
//             w3 = (1 - tx) *      ty,
//             w4 =      tx  *      ty;
//         // 循环处理图像数据
//         for(let i=radius; i < src.height()-radius;i++) {
//             for(let j=radius;j < src.cols-radius;j++) {
//                 // 计算插值
//                 let t = static_cast<float>(w1*src.at<uchar>(i+fy,j+fx) + w2*src.at<uchar>(i+fy,j+cx) + w3*src.at<uchar>(i+cy,j+fx) + w4*src.at<uchar>(i+cy,j+cx));
//                 // 进行编码
//                 dst.at<uchar>(i-radius,j-radius) += ((t > src.at<uchar>(i,j)) || (std::abs(t-src.at<uchar>(i,j)) < std::numeric_limits<float>::epsilon())) << n;
//             }
//         }
//     }
// }

