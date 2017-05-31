/**
 * Created by moyu on 2017/5/31.
 */

const http = require('http');

http.createServer((req, res) => {
    console.log(`[${req.method}] ${req.url} headers: ${JSON.stringify(req.headers, null, 2)}`);
    req.pipe(process.stdout);
    res.end();
}).listen(7890);
