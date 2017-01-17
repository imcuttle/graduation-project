var out = {
    obj(code, result) {
        return {code, result}
    },
    decodeBase64Image (dataString) {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};
        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');
        return response;
    },
    localIp() {
        return new Promise((resolve, reject) => {
            require('dns').lookup(require('os').hostname(), function (err, add, fam) {
                if(err) reject(err)
                else resolve(add)
            })
        })
    },
    md5Hex (text) {
        return require('crypto').createHash('md5').update(text).digest('hex');
    },
    adminCheckMiddleware(req, res, next) {
        const ent = req.ent;
        const data = ent.auth;
        if(!data) {
            res.json(out.obj(400, '参数不全'));
            return;
        }
        if(seqes.indexOf(data)<0) {
            res.json(out.obj(500, '帐号或密码不正确'));
            return;
        }
        next();
    }
}

module.exports = out;