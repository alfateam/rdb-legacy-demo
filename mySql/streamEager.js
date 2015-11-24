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

var db = rdb.mySql('mysql://root@localhost/rdbDemo?multipleStatements=true');

var emptyFilter;
var strategy = {
    lines: {
        orderBy: ['product']
    },
    orderBy: ['orderNo'],
    limit: 5,
};

module.exports = resetDemo()
    .then(function() {
        Order.createReadStream(db, emptyFilter, strategy).on('data', printOrder);
    });

function printOrder(order) {
    var format = 'Order Id: %s, Order No: %s';
    console.log(format, order.id, order.orderNo);
    order.lines.forEach(printLine);
}

function printLine(line) {
    var format = 'Line Id: %s, Order Id: %s, Product: %s';
    console.log(format, line.id, line.orderId, line.product);
}
