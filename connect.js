var rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

var db = rdb('postgres://test:test@localhost/test');
//alternatively: var db = rdb.pg('postgres://postgres:postgres@localhost/test');

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