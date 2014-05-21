var rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

var Customer = rdb.table('_customer');

Customer.primaryColumn('oId').guid().as('id');
Customer.column('oName').string().as('name');
Customer.column('oBalance').numeric().as('balance');
Customer.column('oRegdate').date().as('registeredDate');
Customer.column('oActive').boolean().as('active');
Customer.column('oPicture').binary().as('picture');

var db = rdb('postgres://postgres:postgres@localhost/test');

resetDemo()
    .then(beginTransaction)
    .then(getById)
    .then(printCustomer)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed)
    .then(final);

function beginTransaction() {
    return db.transaction();
}

function getById() {
    return Customer.getById('58d52776-2866-4fbe-8072-cdf13370959b');
}

function printCustomer(customer) {
    console.log('id: %s, customerId: %s, status: %s, tax: %s, units: %s, regDate: %s, sum: %s, image: %s', Customer.id, Customer.customerId, Customer.status, Customer.tax, Customer.units, Customer.regDate, Customer.sum, Customer.image);
}

function printJSON(json) {
    console.log(json);
}

function onOk() {
    console.log('Success.');
}

function final() {
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('failed: ' + err);
    if (err.stack)
        console.log('stack: ' + err.stack);
}