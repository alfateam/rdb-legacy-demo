var rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

var Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid(); //property name will also be cId
Customer.column('cName').string(); //property name will also be cName

var db = rdb('postgres://postgres:postgres@localhost/test');

module.exports = resetDemo()
    .then(db.transaction)
    .then(insert)
    .then(print) 
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function insert() {
    var customer = Customer.insert('abcdef01-0000-0000-0000-000000000000')
    customer.cName = 'Paul';
    return customer.toJSON();
}

function print(json) {
    console.log(json);
}

function onOk() {
    console.log('Success');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err);
}