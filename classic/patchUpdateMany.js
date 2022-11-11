let {createPatch} = require('rdb-client');
let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Order = rdb.table('_order');
Order.primaryColumn('id').guid();
Order.column('orderNo').string();

let OrderLine = rdb.table('_orderLine');
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
            let orderIdWithNoLines = 'a0000000-a000-0000-0000-000000000000';
            let filter = Order.id.eq(orderIdWithNoLines);
            let original = await Order.getManyDto(filter);
            let orders = JSON.parse(JSON.stringify(original));
            orders[0].lines[0].product = 'test data';
            let patch = createPatch(original, orders);
            console.log(patch);
            await Order.patch(patch);

            orders = await Order.getManyDto(filter);
            console.log(orders[0]);
        });
    } catch (e) {
        console.log(e.stack);
    }
}();