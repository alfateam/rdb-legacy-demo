var rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');
rdb.log(console.log); //will log sql and parameters
var Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');

var db = rdb('postgres://postgres:postgres@localhost/test');

module.exports = resetDemo()
    .then(db.transaction)
    .then(getById)
    .then(update)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function getById() {
    return Customer.getById('a0000000-0000-0000-0000-000000000000');
}

function update(customer) {
    customer.name = 'Ringo'; 
}

function onOk() {
    console.log('Success');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err);
}