
var rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

var Order = rdb.table('_order');
var OrderLine = rdb.table('_orderLine');

Order.primaryColumn('id').guid();
Order.column('orderNo').string();

OrderLine.primaryColumn('id').guid();
OrderLine.column('orderId').guid();
OrderLine.column('product').string();

var line_order_relation = OrderLine.join(Order).by('orderId').as('order');
Order.hasMany(line_order_relation).as('lines');

var db = rdb('postgres://rdb:rdb@localhost/rdbdemo');
var orderIdWithNoLines = 'c0000000-c000-0000-0000-000000000000';

module.exports = resetDemo()
    .then(db.transaction)
    .then(getById)
    .then(insertOrderLines)
    .then(removeOrderLines)
    .then(verifyUpdated)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function getById() {
    return Order.getById(orderIdWithNoLines);
}

async function insertOrderLines(order) {
    let patch = [{
        "op": "add",
        "path": "/lines",
        "value": {
            "eeeeeeee-0000-0000-0000-000000000000": {
                "id": "eeeeeeee-0000-0000-0000-000000000000",
                "orderId": orderIdWithNoLines,
                "product": "Roller blades"
            },
            "eeeeeeee-0002-0000-0000-000000000000": {
                "id": "eeeeeeee-0002-0000-0000-000000000000",
                "orderId": orderIdWithNoLines,
                "product": "Helmet",
            }
        }
    }];
    await order.applyPatch(patch);
    return order;
}

async function removeOrderLines(order) {
    let patch = [{
        "op": "remove",
        "path": "/lines"
    }];
    await order.applyPatch(patch);
    return order;
}

function verifyUpdated(order) {
    return order.lines.then(verifyUpdatedLines);
}

function verifyUpdatedLines(lines) {
    // console.log(lines[0].product);
    // console.log(lines[1].product);
    console.log('verify updated length')
    console.log(lines.length)
    if (lines.length !== 0)
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