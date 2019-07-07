var rdb = require('rdb'),
    resetDemo = require('../db/resetDemo');

var Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cBalance').numeric().as('balance');
Customer.column('cName').string().as('name');

var db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = resetDemo()
    .then(db.transaction)
    .then(getFilteredCustomers)
    .then(printCustomers)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function getFilteredCustomers() {
    var filter = Customer.balance.between(3000, 8123);
    return Customer.getMany(filter);
}

function printCustomers(customers) {
    customers.forEach(printCustomer);

    function printCustomer(customer) {
        console.log('Customer Id: %s, name: %s, balance : %s', customer.id, customer.name, customer.balance);
    }
}

function onOk() {
    console.log('Success');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err);
}