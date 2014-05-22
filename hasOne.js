var rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

var Order = rdb.table('_order');
var DeliveryAddress = rdb.table('_deliveryAddress');

Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');

DeliveryAddress.primaryColumn('dId').guid().as('id');
DeliveryAddress.column('dOrderId').string().as('orderId');
DeliveryAddress.column('dName').string().as('name');
DeliveryAddress.column('dStreet').string().as('street');
DeliveryAddress.column('dPostalCode').string().as('postalCode');
DeliveryAddress.column('dPostalPlace').string().as('postalPlace');
DeliveryAddress.column('dCountryCode').string().as('countryCode');
DeliveryAddress.column('dCountry').string().as('country');

var deliveryAddress_order_relation = DeliveryAddress.join(Order).by('dOrderId').as('order');
Order.hasOne(deliveryAddress_order_relation).as('deliveryAddress');

var db = rdb('postgres://postgres:postgres@localhost/test');

resetDemo()
    .then(db.transaction)
    .then(getOrder)
    .then(printOrder)
    .then(printDeliveryAddress)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .done(onOk, onFailed);

function getOrder() {
    return Order.getById('b0000000-b000-0000-0000-000000000000');
}

function printOrder(order) {
    var format = 'Order Id: %s, Order No: %s'; 
    var args = [format, order.id, order.orderNo];
    console.log.apply(null,args);
    return order.deliveryAddress; //this is a promise
}

function printDeliveryAddress(address) {
    var format = 'DeliveryAddress Id: %s, Order Id: %s, %s, %s, %s %s, %s %s'; 
    var args = [format, address.id, address.orderId, address.name, address.street, address.postalCode, address.postalPlace, address.countryCode, address.country];
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