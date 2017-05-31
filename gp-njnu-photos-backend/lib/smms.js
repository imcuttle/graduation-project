/**
 * Created by moyu on 2017/1/16.
 */
// https://sm.ms/api/upload
var FormData = require('form-data');
var https = require('https');
var md5 = require('./utils').md5Hex;
var form = new FormData();

module.exports = {
    upload(buffer, options) {
        if (buffer.length >= 1024 * 1024 * 5) {
            return Promise.reject(false);
        }
        var form = new FormData();
        form.append('smfile', buffer, Object.assign({
            filename: md5(buffer),
            contentType: 'image/jpeg'
        }, options));


        return new Promise((resolve, reject) => {
            var request = https.request({
                method: 'POST',
                hostname: 'sm.ms',
                host: 'sm.ms',
                path: '/api/upload?ssl=true',
                headers: Object.assign({}, form.getHeaders(), {
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
                })
            }, (res) => {
                var all = '';
                res.on('data', chunk => all += chunk)
                res.on('end', () => {
                    all = JSON.parse(all);
                    console.log(all);
                    resolve(all.code == 'success' && all.data)
                })
            }).on('error', (err) => {
                console.error(err);
                resolve(false)
            });

            form//.on('data', (chunk) => console.log(chunk.toString()))
                .pipe(request);
        })
    },
    del(hash) {
        https.get('https://sm.ms/api/delete/' + hash)
    }
}


// module.exports.upload(require('fs').readFileSync('/Users/moyu/my-code/mixCode/Graduation-Project/gp-njnu-photos-backend/data/images/2013/011301/01130101.jpg'))
