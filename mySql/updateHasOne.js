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

let db = rdb('mysql://rdb:rdb@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let address = DeliveryAddress.insert('eeeeeeee-0000-0000-0000-000000000000');
            address.orderId = 'a0000000-a000-0000-0000-000000000000';
            address.name = 'Sgt. Pepper';
            address.street = 'L18 Penny Lane';
            let order = await address.order;
            console.log((await order.deliveryAddress).street);
        });
    } catch (e) {
        console.log(e.stack);
    }
}();