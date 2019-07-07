var rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

var db = rdb('postgres://rdb:rdb@localhost/rdbdemo');
//alternatively: var db = rdb.pg('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = resetDemo()
    .then(db.transaction)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function onOk() {
    console.log('Success');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err);
}