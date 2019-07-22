const rdb = require('rdb');
const resetDemo = require('./db/resetDemo');

const Order = rdb.table('_order');
const OrderLine = rdb.table('_orderLine');

Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');

OrderLine.primaryColumn('lId').guid().as('id');
OrderLine.column('lOrderId').guid().as('orderId');
OrderLine.column('lProduct').string().as('product');

const line_order_relation = OrderLine.join(Order).by('lOrderId').as('order');
Order.hasMany(line_order_relation).as('lines');

const db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let orderIdWithNoLines = 'c0000000-c000-0000-0000-000000000000';

            let line = OrderLine.insert('eeeeeeee-0001-0000-0000-000000000000');
            line.orderId = orderIdWithNoLines;
            line.product = 'Roller blades';

            const line2 = OrderLine.insert('eeeeeeee-0002-0000-0000-000000000000');
            line2.orderId = orderIdWithNoLines;
            line2.product = 'Helmet';

            let order = await line.order;
            let lines = await order.lines;
            console.log('Number of lines: ' + lines.length);
        });
    } catch (e) {
        console.log(e.stack);
    }
}();