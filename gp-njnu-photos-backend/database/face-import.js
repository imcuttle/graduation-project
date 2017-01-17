/**
 * Created by moyu on 2017/1/16.
 */
var connection = require('./base');
var newPromise = require('./base').newPromise;
var getTableNameFromFileName = require('./base').getTableNameFromFileName;
var table = getTableNameFromFileName(__filename);
var smmsDel = require('../lib/smms').del;
var sFilter = connection.likeStrFilter;

/*
 SELECT `face_import`.`stuid`,
 `face_import`.`time`,
 `face_import`.`hash`,
 `face_import`.`face_url`
 FROM `gp`.`face_import`;
 */

var out = {
    selectAll() {
        return newPromise((ok, fail) => {
            connection.query('select * from ??', [table], (err, rlt) => {
                if (err) {
                    fail(err);
                } else {
                    ok(rlt);
                }
            })
        })
    },

    select(stuno) {
        return newPromise((ok, fail) => {
            connection.query('select * from ?? where stuid=?', [table, stuno], (err, rlt) => {
                if (err) {
                    fail(err);
                } else {
                    ok(rlt);
                }
            })
        })
    },

    insert(stuid, hash, face_url) {
        return newPromise((ok, fail) => {
            connection.query('insert into ?? values(?, NOW(), ?, ?)', [table, stuid, hash, face_url],
                (err, rlt) => {
                    if (err) fail(err);
                    else ok(rlt.affectedRows>0);
                }
            )
        })
    },

    delete(hash, stuno) {
        return newPromise((ok, fail) => {
            connection.query('delete from ?? where hash=? and stuid=?', [table, hash, stuno],
                (err, rlt) => {
                    if (err) fail(err);
                    else {
                        if(rlt.affectedRows>0) {
                            smmsDel(hash);
                        }
                        ok(rlt.affectedRows>0);
                    }
                }
            )
        })
    },

    deleteByHash(hash) {
        return newPromise((ok, fail) => {
            connection.query('delete from ?? where hash=?', [table, hash],
                (err, rlt) => {
                    if (err) fail(err);
                    else {
                        if(rlt.affectedRows>0) {
                            smmsDel(hash);
                        }
                        ok(rlt.affectedRows>0);
                    }
                }
            )
        })
    }
}

// out.selectAll().then(console.log, console.error)

module.exports = out;