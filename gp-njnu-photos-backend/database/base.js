var mysql = require('mysql');
var path = require('path');

var config = {
    host     : 'localhost',
    user     : 'root',
    password : '110114',
    database : 'gp',
    // queueLimit: 50,
    // connectionLimit: 20,
    // waitForConnections: false
};

var instant = process.env.NODE_STATUS!='run';
var database = !instant && mysql.createPool(config);

var poolQuery = function() {
    var argArr = Array.from(arguments);
    var cb = argArr.splice(-1)[0];

    database.getConnection(function(err, dbConnection) {
        if (err) { console.error(err); return; }
        dbConnection.query.apply(dbConnection, argArr.concat(function() {
            // dbConnection.end();
            dbConnection.release(); // return to the pool
            cb.apply(null, Array.from(arguments));
        }));
    })
}
var connQuery = function() {
    var argArr = Array.from(arguments);
    var dbConnection = mysql.createConnection(config);

    dbConnection.connect();
    dbConnection.query.apply(dbConnection, argArr);
    dbConnection.end();
}

module.exports = {
    _createPool(config) {
        return mysql.createPool(config);
    },
    query: instant?connQuery:poolQuery,
    format: mysql.format,
    likeStrFilter: function (s) {
        return '%'+s.replace(/([_%])/g,'*'+RegExp.$1)+'%';
    },
    newPromise (excutor) {
        return new Promise(excutor);
    },
    getTableNameFromFileName (filename) {
        return path.basename(filename).replace(/\..*$/, '').replace(/-/g, '_')
    },
    _closeDatabase () {
        database && !database._closed && database.end();
        database = null;
    }
};


