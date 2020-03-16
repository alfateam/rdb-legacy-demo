let createPatch = require('./createPatch');
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

let db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let filter = Order.id.eq('a0000000-a000-0000-0000-000000000000');
            let original = await Order.getManyDto(filter);

            let orders = JSON.parse(JSON.stringify(original));
            orders[0].lines = undefined;

            let patch = createPatch(original, orders);
            console.log(patch)
            await Order.patch(patch);

            orders = await Order.getManyDto(filter);
            console.log(JSON.stringify(orders))
        });
    } catch (e) {
        console.log(e.stack);
    }
}();