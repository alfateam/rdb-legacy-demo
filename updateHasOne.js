let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Order = rdb.table('_order');
let DeliveryAddress = rdb.table('_deliveryAddress');

Order.primaryColumn('id').guid();
Order.column('orderNo').string();

DeliveryAddress.primaryColumn('id').guid();
DeliveryAddress.column('orderId').string();
DeliveryAddress.column('name').string();
DeliveryAddress.column('street').string();

let deliveryAddress_order_relation = DeliveryAddress.join(Order).by('orderId').as('order');
Order.hasOne(deliveryAddress_order_relation).as('deliveryAddress');

let db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

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