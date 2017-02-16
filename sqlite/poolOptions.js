var rdb = require('rdb');

var poolOptions = {size: 20};
var db = rdb.sqlite(__dirname + '/db/rdbDemo', poolOptions);

module.exports = db.transaction()
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function onOk() {
    console.log('Success. Created pool with max 20 connections.');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err);
}