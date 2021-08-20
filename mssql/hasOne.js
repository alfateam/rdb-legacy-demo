let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');
let {inspect} = require('util');

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

let db = rdb.mssql('server=.;Database=rdbDemo;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let order = await Order.getById('b0000000-b000-0000-0000-000000000000', {deliveryAddress: true});
            console.log(order);
        });
    } catch (e) {
        console.log(e.stack);
    }
}();