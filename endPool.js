var rdb = require('rdb');

var db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = db.transaction()
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(db.end)
    .then(onOk, onFailed);

function onOk() {
    console.log('Pool ended.');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err);
}