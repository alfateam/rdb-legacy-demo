let rdb = require('rdb'),
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

let emptyFilter;
let strategy = {
    lines: {
        orderBy: ['product']
    },
    orderBy: ['orderNo']
};

module.exports = resetDemo()
    .then(function() {
        Order.createReadStream(db, emptyFilter, strategy).on('data', printOrder);
    });

function printOrder(order) {
    let format = 'Order Id: %s, Order No: %s';
    console.log(format, order.id, order.orderNo);
    order.lines.forEach(printLine);
}

function printLine(line) {
    let format = 'Line Id: %s, Order Id: %s, Product: %s';
    console.log(format, line.id, line.orderId, line.product);
}
