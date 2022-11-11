let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Order = rdb.table('_order');
let OrderLine = rdb.table('_orderLine');

Order.primaryColumn('id').guid();
Order.column('orderNo').string();

OrderLine.primaryColumn('id').guid();
OrderLine.column('orderId').guid();
OrderLine.column('product').string();

let line_order_relation = OrderLine.join(Order).by('orderId').as('order');
Order.hasMany(line_order_relation).as('lines');

let db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let orderIdWithNoLines = 'c0000000-c000-0000-0000-000000000000';

            let line = OrderLine.insert('eeeeeeee-0001-0000-0000-000000000000');
            line.orderId = orderIdWithNoLines;
            line.product = 'Roller blades';

            let line2 = OrderLine.insert('eeeeeeee-0002-0000-0000-000000000000');
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