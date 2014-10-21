var rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

var Customer = rdb.table('_customer');
var Order = rdb.table('_order');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');

Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');
Order.column('oCustomerId').guid().as('customerId');

Order.join(Customer).by('oCustomerId').as('customer');

var db = rdb('postgres://postgres:postgres@localhost/test');

module.exports = resetDemo()
    .then(db.transaction)
    .then(getById)
    .then(update)
    .then(verifyUpdated)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function getById() {
    return Order.getById('b0000000-b000-0000-0000-000000000000');
}

function update(order) {
    var yokoId = '12345678-0000-0000-0000-000000000000';
    order.customerId = yokoId;
    return order.customer; 
}

function verifyUpdated(customer) {
    if (customer.name !== 'Yoko')
        throw new Error('this will not happen');
}

function onOk() {
    console.log('Success');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err);
}