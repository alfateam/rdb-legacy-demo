var rdb = require('rdb');

var db = rdb.sqlite(__dirname + '/db/rdbDemo');

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