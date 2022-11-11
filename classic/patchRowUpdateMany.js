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
                let o2 = await Order.getById('a0000000-a000-0000-0000-000000000000', {lines: null});
                let o2Dto = await o2.toDto({lines: null});
                let oData = JSON.parse(JSON.stringify(o2Dto));
                oData.lines[0].product = "test data";
                let p = createPatch(o2Dto, oData);
                console.log(p);
                await o2.patch(p);
                console.log(await o2.toDto());
        });
    } catch (e) {
        console.log(e.stack);
    }
}();
