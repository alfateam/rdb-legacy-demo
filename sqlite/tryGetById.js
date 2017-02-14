var rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

var Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');
Customer.column('cBalance').numeric().as('balance');
Customer.column('cRegdate').date().as('registeredDate');
Customer.column('cIsActive').boolean().as('isActive');
Customer.column('cPicture').binary().as('picture');

var db = rdb.sqlite(__dirname + '/db/rdbDemo');

module.exports = resetDemo()
    .then(db.transaction)
    .then(tryGetById)
    .then(printCustomer)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function tryGetById() {
    return Customer.tryGetById('a0000000-0000-0000-0000-000000000000');
}

function printCustomer(customer) {
    if (customer) {

        var format = 'Customer Id: %s, name: %s, Balance: %s, Registered Date: %s, Is Active: %s, Picture: %s';
        var args = [format, customer.id, customer.name, customer.balance, customer.registeredDate, customer.isActive, customer.picture];
        console.log.apply(null, args);
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
