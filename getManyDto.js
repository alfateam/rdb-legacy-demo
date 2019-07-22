var rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

var Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');

var db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = resetDemo()
    .then(db.transaction)
    .then(getAllCustomers)
    .then(printCustomers)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function getAllCustomers() {
    return Customer.getManyDto();
}

function printCustomers(customers) {
    console.log(customers);
}

function onOk() {
    console.log('Success');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err);
}