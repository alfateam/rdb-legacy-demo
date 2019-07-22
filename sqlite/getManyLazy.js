let rdb = require('rdb'),
    promise = require('promise/domains'),
    resetDemo = require('./db/resetDemo');

let Order = rdb.table('_order');
let OrderLine = rdb.table('_orderLine');

Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');

OrderLine.primaryColumn('lId').guid().as('id');
OrderLine.column('lOrderId').guid().as('orderId');
OrderLine.column('lProduct').string().as('product');

let line_order_relation = OrderLine.join(Order).by('lOrderId').as('order');
Order.hasMany(line_order_relation).as('lines');

let db = rdb.sqlite(__dirname + '/db/rdbDemo');

module.exports = resetDemo()
    .then(db.transaction)
    .then(getAllOrders)
    .then(printOrders)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function getAllOrders() {
   let filter = Order.orderNo.startsWith('100');
    return Order.getMany(filter,{limit: 2, orderBy: 'orderNo'});
}

function printOrders(orders) {
    let printAllLines = [];
    orders.forEach(printOrder);

    function printOrder(order) {
        let format = 'Order Id: %s, Order No: %s';
        let args = [format, order.id, order.orderNo];
        console.log.apply(null,args);
        printAllLines.push(order.lines.then(printLines));
    }
    return promise.all(printAllLines);
}

function printLines(lines) {
    lines.forEach(printLine);

    function printLine(line) {
        let format = 'Line Id: %s, Order Id: %s, Product: %s';
        let args = [format, line.id, line.orderId, line.product];
        console.log.apply(null,args);
    }
}

function onOk() {
    console.log('Success');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err);
}