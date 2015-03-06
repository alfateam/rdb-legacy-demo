var rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

var poolOptions = {size: 20};
var db = rdb.mySql('mysql://root@localhost/rdbDemo?multipleStatements=true', poolOptions);

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