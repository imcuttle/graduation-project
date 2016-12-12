var querystring = require('querystring');
var request = require('http').request;
var u = require('url');
var zlib = require("zlib");
var $ = require('cheerio');


module.exports = {
    getGzip(url, params, type) {
        return new Promise(resolve => {
            request(
                u.parse(url), 
                res => {
                    var gunzip = zlib.createGunzip();
                    res.pipe(gunzip);
                    var chunks = [];
                    gunzip.on('data', function(chunk) {
                        chunks.push(chunk);
                    });
                    gunzip.on('end', function() {
                        var html = Buffer.concat(chunks).toString();
                        if(type==='jq') {
                            resolve($.load(html))
                        } else {
                            resolve(html);
                        }
                    })

                }
            ).end();
        })
    },

    get(url, params, type, headers) {
        return new Promise(resolve => {
            request(
                Object.assign({},u.parse(url+'?'+querystring.stringify(params)), {headers: headers || {}}),
                res => {
                    if(res.statusCode!==200) {
                        console.error('GET', res.statusCode, url, JSON.stringify(params))
                    }
                    var chunks = [];
                    res.on('data', function(chunk) {
                        chunks.push(chunk);
                    });
                    res.on('end', function() {
                        var html = Buffer.concat(chunks).toString();
                        if(type==='jq') {
                            resolve($.load(html))
                        } else if('json') {
                            resolve(JSON.parse(html));
                        } else
                            resolve(html);
                    })

                }
            ).end();
        })
    },
    post(url, params, type, headers, getHeader) {
        return new Promise(resolve => {
            var req = request(
                Object.assign(u.parse(url), {
                    method: 'POST',
                    headers: headers || {}
                }),
                res => {
                    if(res.statusCode!==200) {
                        console.error('POST', res.statusCode, url, JSON.stringify(params))
                    }
                    if(getHeader) {
                        resolve(res.headers)
                        return
                    }
                    var chunks = [];
                    res.on('data', function(chunk) {
                        chunks.push(chunk);
                    });
                    res.on('end', function() {
                        var html = Buffer.concat(chunks).toString();
                        if(type==='jq') {
                            resolve($.load(html))
                        } else {
                            resolve(html);
                        }
                    })

                }
            )
            req.on('connect', ()=>console.log('connect'))
            req.on('abort', ()=>console.log('abort'))
            req.on('aborted', ()=>console.log('aborted'))
            req.setSocketKeepAlive(true)
            req.end(querystring.stringify(params));
        })
    },
    postFormData(url, type, form, headers, getHeader) {
        return new Promise(resolve=>{
            var req = request(Object.assign({}, u.parse(url), {
                method: 'POST',
                headers: Object.assign({}, headers, form.getHeaders())
            }))
            // form.pipe(require('fs').createWriteStream('test.txt'))
            form.pipe(req)
            req.on('response', res => {
                if(getHeader) {
                    resolve(res.headers)
                    return
                }
                if(res.statusCode!==200) {
                    console.error('FORMDATA', res.statusCode, url, JSON.stringify(res.headers))
                    console.error(JSON.stringify(req._headers))
                }
                var chunks = [];
                res.on('data', function(chunk) {
                    chunks.push(chunk);
                });
                res.on('end', function() {
                    var html = Buffer.concat(chunks).toString();
                    if(type==='jq') {
                        resolve($.load(html))
                    } else {
                        resolve(html);
                    }
                })
            })
        })
    }

}
