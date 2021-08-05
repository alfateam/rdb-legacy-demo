var rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

var Order = rdb.table('_order');
var DeliveryAddress = rdb.table('_deliveryAddress');

Order.primaryColumn('id').guid();
Order.column('orderNo').string();

DeliveryAddress.primaryColumn('id').guid();
DeliveryAddress.column('orderId').string();
DeliveryAddress.column('name').string();
DeliveryAddress.column('street').string();

var deliveryAddress_order_relation = DeliveryAddress.join(Order).by('orderId').as('order');
Order.hasOne(deliveryAddress_order_relation).as('deliveryAddress');

var db = rdb('postgres://rdb:rdb@localhost/rdbdemo');
var orderId = 'a0000000-a000-0000-0000-000000000000';

module.exports = resetDemo()
    .then(db.transaction)
    .then(getById)
    .then(insertDeliveryAddress)
    .then(verifyUpdated)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function getById() {
    return Order.getById(orderId);
}

function insertDeliveryAddress(order) {
    let patch = [{
        "op": "add",
        "path": "/deliveryAddress",
        "value": {
            "id": 'eeeeeeee-0000-0000-0000-000000000000',
            "orderId": orderId, //optional
            "name": "Sgt. Pepper",
            "street": "L18 Penny Lane"
        }
    }];
    return order.applyPatch(patch).then(function() {
        return order;
    })
}

function verifyUpdated(order) {
    return order.deliveryAddress.then(verifyUpdatedAddress);
}

function verifyUpdatedAddress(deliveryAddress) {
    if (deliveryAddress.street !== 'L18 Penny Lane')
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