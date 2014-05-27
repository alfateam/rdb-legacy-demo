var rdb = require('rdb'),
    resetDemo = require('../db/resetDemo');

var Order = rdb.table('_order');
var Customer = rdb.table('_customer');
var OrderLine = rdb.table('_orderLine');

Order.primaryColumn('oId').guid().as('id');
Order.column('oCustomerId').guid().as('customerId');
Order.column('oOrderNo').string().as('orderNo');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cIsActive').boolean().as('isActive');
Customer.column('cBalance').numeric().as('balance');
Customer.column('cName').string().as('name');

OrderLine.primaryColumn('lId').guid().as('id');
OrderLine.column('lOrderId').guid().as('orderId');
OrderLine.column('lProduct').string().as('product');

Order.join(Customer).by('oCustomerId').as('customer');

var line_order_relation = OrderLine.join(Order).by('lOrderId').as('order');
Order.hasMany(line_order_relation).as('lines');



var db = rdb('postgres://postgres:postgres@localhost/test');

resetDemo()
    .then(db.transaction)
    .then(getOrders)
    .then(toJSON)
    .then(print)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function getOrders() {
    var isActive = Order.customer.isActive.eq(true);
    var didOrderCar = Order.lines.product.contains('car');
    var filter = isActive.and(didOrderCar);
    //alternatively rdb.filter.and(isActive).and(didOrderCar);
    return Order.getMany(filter);
}

function toJSON(orders) {
    return orders.toJSON();
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