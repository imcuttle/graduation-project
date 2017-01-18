const spider = require('./spider')
const URL = "http://njnu.chaiziyi.com.cn/getscores";
const FURL = "http://njnu.chaiziyi.com.cn/face"
const HOST = "http://njnu.chaiziyi.com.cn"
const LOGINURL ="http://njnu.chaiziyi.com.cn/login"
const CACHEPATH = './cache.json'

var fs = require('fs')
var crypto = require('crypto');
function md5 (text) {
    return crypto.createHash('md5').update(text).digest('hex');
}

const CACHE =
    !fs.existsSync(CACHEPATH)
    ? {
        checkStudent: {},
        info: {},
        score: {},
        faceUrl: {},
        faceMd5: {}
    } : JSON.parse(fs.readFileSync(CACHEPATH).toString())

console.info('CACHE', CACHE)

var FormData = require('form-data');

setInterval(() => {
    saveCache()
    clearCache()
}, 1000*60*60*24*7);

process.on('exit', () => {
    saveCache()
})

function clearCache() {
    Object.getOwnPropertyNames(CACHE)
        .forEach(name=>CACHE[name]={})
}

function saveCache() {
    fs.writeFileSync(CACHEPATH, JSON.stringify(CACHE))
    console.info("save cache")
}

process.on('SIGINT', () => {
    process.exit(1)
})


module.exports = {
    getCache() {
        return CACHE
    },
    clearCache,
    loginApi(id, pwd) {
        return spider.get("http://api.chaiziyi.com.cn/jwgl/login", {username: id, password: pwd}, 'json')
    },
    scheduleApi(id, pwd, year, term) {
        return this.loginApi(id, pwd).then(json=>Object.keys(json.cookies).map(k=>k+'='+json.cookies[k]).join(''))
        .then(cookie=>spider.get("http://api.chaiziyi.com.cn/jwgl/schedule", {xn: year, xq: term}, 'json', {cookie}))
        .then(x=>{
            if(x.status==200) {
               return x.kcb.map(x=>{
                    return {
                        teacher: x.ls,
                        address: x.skdd,
                        name: x.kcm,
                        time: x.sksj,
                        week: Number(x.rq.substr(1, 1)),
                        segment: Number(x.rq.substr(2, 1))
                    }
                })
            } else {
                return;
            }
        })
    },
    getToken(url) {
        url = url || URL
        return spider.get(url, {}, 'jq')
        .then($=>{
            return $;
        })
        .then($ => $('[name=csrfmiddlewaretoken]').val())
    },
    getFCookie() {
        return this.getToken(LOGINURL).then(t=>{
            return spider
                .post(LOGINURL, {csrfmiddlewaretoken: t, username: 'yucong', password: 'moyuyc'}, '', {
                    Cookie: `csrftoken=${t}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                }, true)
                .then(headers=>{
                    return Array.isArray(headers['set-cookie'])?headers['set-cookie']:[headers['set-cookie']]
                }).then(cookies=> cookies.map(cookie=> {
                    var m = cookie.match(/(?:sessionid|csrftoken)=.*?;/)
                    m = m?m[0]:''
                    if(m.startsWith('csrftoken=')) {
                        t = m.replace(/^csrftoken=/, '').replace(/;$/, '')
                    }
                    return m;
                }).join(' '))
                .then(c=>{
                    return {
                        token: t,
                        cookie: c
                    }
                })
        })
    },
    checkStudent(id, password) {
        if(!id || !password) {
            return Promise.resolve(false)
        }
        if(CACHE.checkStudent[`${id}-${password}`]) {
            return new Promise(r=>r(CACHE.checkStudent[`${id}-${password}`]))
        }
        return this.loginApi(id, password)
            .then(json=>json.status==200)
            .then(f=>{
                // if(f) {
                    CACHE.checkStudent[`${id}-${password}`] = f;
                // }
                return f;
            })
    },
    _getJq(id, password) {
        return this.getToken()
            .then(token=>spider.post(URL,
                {username: id, password, csrfmiddlewaretoken: token},
                'jq',
                {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': 'csrftoken='+token
                }
            ))
    },

    getStudentInfo(id='', password='') {
        if(CACHE.info[id+password] != null) {
            return new Promise(r=>r(CACHE.info[id+password]))
        }
        return this._getJq(id, password)
            .then($ => $('.alert.alert-dismissable.alert-success').length===0 ? null:
                    Object.assign(
                        {img: $('div.col-md-2.column > img').attr('src')},
                        $('body > div > div > div > div:nth-child(5)').text().trim().split(/\s+/).map(val=>val.split('：')[1])
                            .reduce((p, n, i)=>{
                                var k;
                                switch (i) {
                                    case 0: k = 'department'; break;
                                    case 1: k = 'classNo'; break;
                                    case 3: k = 'name'; break;
                                    default: return p;
                                }
                                p[k] = n;
                                return p
                            }, {})
                    )
            ).then(o=>{
                CACHE.info[id+password] = o
                return o;
            })
    },
    getStudentScores(id, password) {
        if(CACHE.score[id] != null) {
            return new Promise(r=>r(CACHE.score[id]))
        }
        return this._getJq(id, password)
            .then($ => {
                var obj = {}, terms = new Set()
                $('.table tbody tr').map((i, tr)=>{
                    var tds = $(tr).find('td');
                    var term = tds.eq(0).text().trim();
                    var subject = tds.eq(2).text().trim();
                    var fullGrade = tds.eq(3).text().trim();
                    var type = tds.eq(4).text().trim();
                    var score = tds.eq(7).text().trim();
                    var grade = tds.eq(8).text().trim();

                    terms.add(term);
                    obj[term] = obj[term] || []
                    obj[term].push({
                        subject, fullGrade, type, score, grade
                    })
                })
                return $('.alert.alert-dismissable.alert-success').length===0 ? null: {map: obj, terms: Array.from(terms)}
            }).then(o=>{
                CACHE.score[id] = o
                return o
            })
    },
    faceMatch(data, type, size) {
        var _md5 = md5(data)
        if(CACHE.faceMd5[_md5]!=null) {
            return Promise.resolve(CACHE.faceMd5[_md5])
        }
        return this.getFCookie()
        .then(ct=>{
            console.info('DATAMATCH', ct)
            var form = new FormData();
            form.append("csrfmiddlewaretoken", ct.token);
            form.append("info_photo", data, {
                filename: `iNjnu-app-${Date.now()}`,
                contentType: type,
                knownLength: +size
            });
            return spider.postFormData(FURL, 'jq', form, {'Cookie': ct.cookie})
            .then($=>this.parseFaceHtml($))
        }).then(o=>{
            CACHE.faceMd5[_md5]=o
            return o
        })
    },
    faceMatchUrl(url) {
        url=url.trim()
        if(CACHE.faceUrl[url] != null) {
            return new Promise(r=>r(CACHE.faceUrl[url]))
        }
        return this.getFCookie()
        .then(ct=>{
            console.info('URLMATCH', ct)
            return spider.post(FURL, {csrfmiddlewaretoken: ct.token, url}, 'jq', {
                'Cookie': ct.cookie,
                'Content-Type': 'application/x-www-form-urlencoded'
            })
            .then($=>this.parseFaceHtml($))
        }).then(o=>{
            CACHE.faceUrl[url] = o
            return o
        })
    },

    stuInfoByIdno(idno) {
        return this.getFCookie()
        .then(ct => {
            var url = 'http://njnu.chaiziyi.com.cn/byidno';
            return spider.get(url, {idno: idno}, 'jq', {Cookie: ct.cookie})
            .then($ => {
                return $('.alert.alert-warning.alert-dismissable').length>0 ? null
                    : {
                        face_url: HOST+'/'+$('body > div > div > div > div > div.col-md-2.column > img:nth-child(1)').attr('src'),
                        name: $('.col-md-10.column table tr:nth-child(2) td:nth-child(2)').text().trim(),
                        rank: $('.col-md-10.column table tr:nth-child(3) td:nth-child(2)').text().trim(),
                        department: $('.col-md-10.column table tr:nth-child(4) td:nth-child(2)').text().trim(),
                        gender: $('.col-md-10.column table tr:nth-child(5) td:nth-child(2)').text().trim(),
                        birth: $('.col-md-10.column table tr:nth-child(14) td:nth-child(2)').text().trim(),
                        address: $('.col-md-10.column table tr:nth-child(23) td:nth-child(2)').text().trim()
                    }
            })
        })
    },

    parseFaceHtml($) {
        var arr = []
        $('div[align=middle]').map((i, div)=>{
            var src = $(div).find('img[src]').attr('src')
            var text = $(div).find('h6').text()
            arr.push({
                src: src.startsWith("http")?src:HOST+src,
                text
            })
        })
        console.log(arr)
        return arr
    }
}

// module.exports.stuInfoByIdno('19130127xx').then(console.log)