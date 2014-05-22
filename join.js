var rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

var Customer = rdb.table('_customer');
var Order = rdb.table('_order');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');
Customer.column('cBalance').numeric().as('balance');
Customer.column('cRegdate').date().as('registeredDate');
Customer.column('cIsActive').boolean().as('isActive');
Customer.column('cPicture').binary().as('picture');

Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');
Order.column('oCustomerId').guid().as('customerId');
Order.join(Customer).by('oCustomerId').as('customer');

var db = rdb('postgres://postgres:postgres@localhost/test');

resetDemo()
    .then(db.transaction)
    .then(getOrder)
    .then(printOrder)
    .then(printCustomer)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .done(onOk, onFailed);

function getOrder() {
    return Order.getById('a0000000-a000-0000-0000-000000000000');
}

function printOrder(order) {
    var format = 'Order Id: %s, Order No: %s, Customer Id: %s'; 
    var args = [format, order.id, order.orderNo, order.customerId];
    console.log.apply(null,args);
    return order.customer;
}

function printCustomer(customer) {
    var format = 'Customer Id: %s, name: %s, Balance: %s, Registered Date: %s, Is Active: %s, Picture: %s'; 
    var args = [format, customer.id, customer.name, customer.balance, customer.registeredDate, customer.isActive, customer.picture];
    console.log.apply(null,args);
}

function onOk() {
    console.log('Success');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    throw(err);
}