let createPatch = require('./createPatch');
let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Order = rdb.table('_order');
let DeliveryAddress = rdb.table('_deliveryAddress');

Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');

DeliveryAddress.primaryColumn('dId').guid().as('id');
DeliveryAddress.column('dOrderId').string().as('orderId');
DeliveryAddress.column('dName').string().as('name');
DeliveryAddress.column('dStreet').string().as('street');

let deliveryAddress_order_relation = DeliveryAddress.join(Order).by('dOrderId').as('order');
Order.hasOne(deliveryAddress_order_relation).as('deliveryAddress');

let db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let filter = Order.id.eq('b0000000-b000-0000-0000-000000000000');
            let original = await Order.getManyDto(filter);
            let orders = JSON.parse(JSON.stringify(original));

            orders[0].deliveryAddress = undefined;

            let patch = createPatch(original, orders);
            console.log(patch)
            await Order.patch(patch);

            orders = await Order.getManyDto(filter);
            console.log(orders[0])
        });
    } catch (e) {
        console.log(e.stack);
    }
}();