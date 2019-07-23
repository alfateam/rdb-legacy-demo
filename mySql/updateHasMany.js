let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Order = rdb.table('_order');
let OrderLine = rdb.table('_orderLine');

Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');

OrderLine.primaryColumn('lId').guid().as('id');
OrderLine.column('lOrderId').guid().as('orderId');
OrderLine.column('lProduct').string().as('product');

let line_order_relation = OrderLine.join(Order).by('lOrderId').as('order');
Order.hasMany(line_order_relation).as('lines');

let db = rdb('mysql://root@localhost/rdbDemo?multipleStatements=true');

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