var rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

var db = rdb.sqlite(__dirname + '/db/rdbDemo');

module.exports = resetDemo()
    .then(db.transaction)
    .then(getUniqueCustomerIds)
    .then(print)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function getUniqueCustomerIds() {
    return rdb.query("SELECT json_array(1,2,'3',4)");
}

function print(rows) {
    console.log(rows);
}

function onOk() {
    console.log('Success');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err);
}
