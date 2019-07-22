let rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

let Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');

let db = rdb.sqlite(__dirname + '/db/rdbDemo');

module.exports = resetDemo()
    .then(db.transaction)
    .then(tryGetFirst)
    .then(printCustomer)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function tryGetFirst() {
    let filter = Customer.name.equal('John');
    return Customer.tryGetFirst(filter);
}

function printCustomer(customer) {
    if (customer) {
        console.log('Customer Id: %s, name: %s', customer.id, customer.name);
    }
    else
        console.log('customer not found');
}

function onOk() {
    console.log('Success');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err);
}