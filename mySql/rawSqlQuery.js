var rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

var db = rdb.mySql('mysql://root@localhost/rdbDemo?multipleStatements=true');

module.exports = resetDemo()
    .then(db.transaction)
    .then(getUniqueCustomerIds)
    .then(print)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function getUniqueCustomerIds() {
    return rdb.query('SELECT DISTINCT oCustomerId AS "customerId" FROM _order');
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
