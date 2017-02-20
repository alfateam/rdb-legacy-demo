var rdb = require('rdb'),
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

var db = rdb.sqlite(__dirname + '/db/rdbDemo');

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
        Order.createJSONReadStream(db, emptyFilter, strategy).pipe(process.stdout);
    });
