let createPatch = require('./createPatch');
let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');

let Order = rdb.table('_order');
Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');
Order.column('oCustomerId').guid().as('customerId');

Order.join(Customer).by('oCustomerId').as('customer');

let db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let filter = Order.id.eq('b0000000-b000-0000-0000-000000000000');
            let orders = await Order.getManyDto(filter, {customer: null});
            let changed = JSON.parse(JSON.stringify(orders));
            let yokoId = '12345678-0000-0000-0000-000000000000';
            changed[0].customerId = yokoId;

            let patch = createPatch(orders, changed);
            console.log(patch);
            await Order.patch(patch);

            orders = await Order.getManyDto(filter, {customer: null});
            console.log(orders[0]);
        });
    } catch (e) {
        console.log(e.stack);
    }
}();