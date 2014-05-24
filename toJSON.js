var rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

var Order = rdb.table('_order');
var OrderLine = rdb.table('_orderLine');
var DeliveryAddress = rdb.table('_deliveryAddress');

Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');
Order.column('oCustomerId').string().as('customerId');

OrderLine.primaryColumn('lId').guid().as('id');
OrderLine.column('lOrderId').string().as('orderId');
OrderLine.column('lProduct').string().as('product');

DeliveryAddress.primaryColumn('dId').guid().as('id');
DeliveryAddress.column('dOrderId').string().as('orderId');
DeliveryAddress.column('dName').string().as('name');
DeliveryAddress.column('dStreet').string().as('street');
DeliveryAddress.column('dPostalCode').string().as('postalCode');
DeliveryAddress.column('dPostalPlace').string().as('postalPlace');
DeliveryAddress.column('dCountryCode').string().as('countryCode');
DeliveryAddress.column('dCountry').string().as('country');

var line_order_relation = OrderLine.join(Order).by('lOrderId').as('order');
Order.hasMany(line_order_relation).as('lines');

var deliveryAddress_order_relation = DeliveryAddress.join(Order).by('dOrderId').as('order');
Order.hasOne(deliveryAddress_order_relation).as('deliveryAddress');

var db = rdb('postgres://postgres:postgres@localhost/test');

resetDemo()
    .then(db.transaction)
    .then(getOrder)
    .then(toJSON)
    .then(print)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .done(onOk, onFailed);

function getOrder() {
    return Order.getById('b0000000-b000-0000-0000-000000000000');
}

function toJSON(order) {
    return order.toJSON(/*strategy*/);
    //default strategy, expand all hasOne and hasMany relations
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
    throw(err);
}