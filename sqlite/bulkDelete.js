let rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

let Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');
Customer.column('cBalance').numeric().as('balance');
Customer.column('cRegdate').date().as('registeredDate');
Customer.column('cIsActive').boolean().as('isActive');
Customer.column('cPicture').binary().as('picture');

let db = rdb.sqlite(__dirname + '/db/rdbDemo');

module.exports = resetDemo()
    .then(db.transaction)
    .then(deleteCustomer)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function deleteCustomer() {
    let filter = Customer.id.eq('87654321-0000-0000-0000-000000000000');
    return Customer.delete(filter);
}

function onOk() {
    console.log('Success');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err.stack);
}