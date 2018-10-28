const rdb = require('rdb');
const resetDemo = require('./db/resetDemo');

const Order = rdb.table('_order');
const DeliveryAddress = rdb.table('_deliveryAddress');

Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');

DeliveryAddress.primaryColumn('dId').guid().as('id');
DeliveryAddress.column('dOrderId').string().as('orderId');
DeliveryAddress.column('dName').string().as('name');
DeliveryAddress.column('dStreet').string().as('street');

const deliveryAddress_order_relation = DeliveryAddress.join(Order).by('dOrderId').as('order');
Order.hasOne(deliveryAddress_order_relation).as('deliveryAddress');

const db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction();
        let address = DeliveryAddress.insert('eeeeeeee-0000-0000-0000-000000000000');
        address.orderId = 'a0000000-a000-0000-0000-000000000000';
        address.name = 'Sgt. Pepper';
        address.street = 'L18 Penny Lane';
        let order = await address.order;
        if ((await order.deliveryAddress).street !== 'L18 Penny Lane')
            throw new Error('this will not happen');
        await rdb.commit();
        console.log('Waiting for connection pool to teardown....');
    } catch (e) {
        console.log(e.stack);
        rdb.rollback();
    }
}();