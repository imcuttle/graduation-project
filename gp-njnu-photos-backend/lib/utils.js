module.exports = {
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
    md5 (text) {
        return require('crypto').createHash('md5').update(text).digest('hex');
    }
}