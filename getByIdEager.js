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
    .then(getOrderWithCustomer)
    .then(printOrder)
    .then(printCustomer)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function getOrderWithCustomer() {
    var fetchingStrategy = {customer : null}; //alternatively: {customer : {}} 
    return Order.getById('a0000000-a000-0000-0000-000000000000', fetchingStrategy);
}

function printOrder(order) {
    var format = 'Order Id: %s, Order No: %s, Customer Id: %s'; 
    var args = [format, order.id, order.orderNo, order.customerId];
    console.log.apply(null,args);
    return order.customer; //this is a promise
}

function printCustomer(customer) {
    if (!customer)
        return;
    console.log('Customer Id: %s, name: %s', customer.id, customer.name);
}

function onOk() {
    console.log('Success');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err);
}