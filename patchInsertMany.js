let {createPatch} = require('rdb-client');
let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Order = rdb.table('_order');
Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');

let OrderLine = rdb.table('_orderLine');
OrderLine.primaryColumn('lId').guid().as('id');
OrderLine.column('lOrderId').guid().as('orderId');
OrderLine.column('lProduct').string().as('product');

let line_order_relation = OrderLine.join(Order).by('lOrderId').as('order');
Order.hasMany(line_order_relation).as('lines');

let db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let orderIdWithNoLines = 'c0000000-c000-0000-0000-000000000000';
            let filter = Order.id.eq(orderIdWithNoLines);
            let original = await Order.getManyDto(filter);
            //delete original[0].lines;
            let orders = JSON.parse(JSON.stringify(original));
            let line = {
                id: 'eeeeeeee-0001-0000-0000-000000000000',
                orderId: orderIdWithNoLines,
                product: 'Roller blades'
            };

            let line2 = {
                id: 'eeeeeeee-0002-0000-0000-000000000000',
                orderId: orderIdWithNoLines,
                product: 'Helmet'
            };
            orders[0].lines = [line, line2];
            let patch = createPatch(original, orders);
            await Order.patch(patch);

            orders = await Order.getManyDto(filter);
            console.log(orders[0]);
        });
    } catch (e) {
        console.log(e.stack);
    }
}();