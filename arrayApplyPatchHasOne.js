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
var orderId = 'bb0b0000-a000-0000-0000-000000000000';
// var orderId = 'a0000000-a000-0000-0000-000000000000';
rdb.log(console.log);

module.exports = resetDemo()
    .then(db.transaction)
    .then(insertOrder)
    // .then(insertDeliveryAddress)
    .then(getById)
    // .then(updateDeliveryAddress)
    // .then(deleteDeliveryAddress)
    .then(verifyUpdated)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function getById() {
    return Order.getById(orderId);
}

function insertOrder

async function insertDeliveryAddress(order) {
    // var address = DeliveryAddress.insert('eeeeeeee-0000-0000-0000-000000000000');
    // address.orderId = 'a0000000-a000-0000-0000-000000000000';
    // address.name = 'Sgt. Pepper';
    // address.street = 'L18 Penny Lane';
    // return order;
    let patch = [{
        "op": "add",
        "path": "/deliveryAddress",
        "value": {
            "id": 'eeeeeeee-0000-0000-0000-000000000000',
            "orderId": orderId, //optional foreign key
            "name": "Sgt. Pepper",
            "street": "L14 Penny Lane"
        }
    }];
    await order.applyPatch(patch);
    return order;
}

async function deleteDeliveryAddress(order) {
    let patch = [{
        "op": "remove",
        "path": "/deliveryAddress"
    }];
    await order.applyPatch(patch);
    return order;
}

async function updateDeliveryAddress(order) {
    let patch = [
        {
            "op": "remove",
            "path": "/deliveryAddress/name"
        }
        ,
        {
        "op": "replace",
        "path": "/deliveryAddress/street",
        "value": "L18 Penny Lane"
        }
    ];

    await order.applyPatch(patch);
    return order;
}

function verifyUpdated(order) {
    return order.deliveryAddress.then(verifyUpdatedAddress);
}

// function verifyUpdatedAddress(deliveryAddress) {
    // if (deliveryAddress)
    //     throw new Error('expected none deliveryaddress');
    // if (deliveryAddress.street !== 'L18 Penny Lane')
    //     throw new Error('this will not happen');
// }
function verifyUpdatedAddress(deliveryAddress) {
    if (deliveryAddress.street !== 'L18 Penny Lane')
        throw new Error('this will not happen');
    if (deliveryAddress.name)
        throw new Error('Did not expect name');
}

function onOk() {
    console.log('Success');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err);
}