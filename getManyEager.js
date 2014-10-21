var rdb = require('rdb'),
    promise = require('promise'),
    resetDemo = require('./db/resetDemo');

var Order = rdb.table('_order');
var OrderLine = rdb.table('_orderLine');

Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');

OrderLine.primaryColumn('lId').guid().as('id');
OrderLine.column('lOrderId').guid().as('orderId');
OrderLine.column('lProduct').string().as('product');

var line_order_relation = OrderLine.join(Order).by('lOrderId').as('order');
Order.hasMany(line_order_relation).as('lines');

var db = rdb('postgres://postgres:postgres@localhost/test');

module.exports = resetDemo()
    .then(db.transaction)
    .then(getAllOrders)
    .then(printOrders)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function getAllOrders() {
    var emptyFilter;
    var strategy = {lines : null};
    return Order.getMany(emptyFilter, strategy);
}

function printOrders(orders) {
    var printAllLines = [];
    orders.forEach(printOrder);

    function printOrder(order) {
        var format = 'Order Id: %s, Order No: %s'; 
        var args = [format, order.id, order.orderNo];
        console.log.apply(null,args);
        printAllLines.push(order.lines.then(printLines));
    }
    return promise.all(printAllLines);
}

function printLines(lines) {
    lines.forEach(printLine);

    function printLine(line) {
        var format = 'Line Id: %s, Order Id: %s, Product: %s'; 
        var args = [format, line.id, line.orderId, line.product];
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