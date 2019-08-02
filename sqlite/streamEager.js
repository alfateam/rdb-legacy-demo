let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');
let inspect = require('util').inspect;

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

module.exports = async function() {
    try {
        await resetDemo();
        let emptyFilter;
        let strategy = {
            lines: {
                orderBy: ['product']
            },
            orderBy: ['orderNo']
        };
        Order.createReadStream(db, emptyFilter, strategy).on('data', printOrder);
    } catch (e) {
        console.log(e.stack);
    }
}();

function printOrder(order) {
    console.log(inspect(order, false, 10));
}