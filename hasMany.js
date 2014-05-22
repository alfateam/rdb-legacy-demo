var rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

var Order = rdb.table('_order');
var OrderLine = rdb.table('_orderLine');

Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');
Order.column('oCustomerId').guid().as('customerId');

OrderLine.primaryColumn('lId').guid().as('id');
OrderLine.column('lOrderId').string().as('orderId');
OrderLine.column('lProduct').string().as('product');
var line_order_join = OrderLine.join(Order).by('lOrderId').as('order');

Order.hasMany(line_order_join).as('lines');


var db = rdb('postgres://postgres:postgres@localhost/test');

resetDemo()
    .then(db.transaction)
    .then(getOrder)
    .then(printOrder)
    .then(printLines)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .done(onOk, onFailed);

function getOrder() {
    return Order.getById('b0000000-b000-0000-0000-000000000000');
}

function printOrder(order) {
    var format = 'Order Id: %s, Order No: %s, Customer Id: %s'; 
    var args = [format, order.id, order.orderNo, order.customerId];
    console.log.apply(null,args);
    return order.lines;
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
    throw(err);
}