let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Order = rdb.table('_order');
let Customer = rdb.table('_customer');
let OrderLine = rdb.table('_orderLine');
let DeliveryAddress = rdb.table('_deliveryAddress');

Order.primaryColumn('id').guid();
Order.column('orderNo').string();
Order.column('customerId').string();

Customer.primaryColumn('id').guid();
Customer.column('name').string();

OrderLine.primaryColumn('id').guid();
OrderLine.column('orderId').string();
OrderLine.column('product').string();

DeliveryAddress.primaryColumn('id').guid();
DeliveryAddress.column('orderId').string();
DeliveryAddress.column('name').string();
DeliveryAddress.column('street').string();

Order.join(Customer).by('customerId').as('customer');

let line_order_relation = OrderLine.join(Order).by('orderId').as('order');
Order.hasMany(line_order_relation).as('lines');

let deliveryAddress_order_relation = DeliveryAddress.join(Order).by('orderId').as('order');
Order.hasOne(deliveryAddress_order_relation).as('deliveryAddress');

let db = rdb('mysql://rdb:rdb@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let order = await Order.getById('b0000000-b000-0000-0000-000000000000');
            let strategy = {
                lines: {
                    orderBy: ['product']
                    //alternative: orderBy: ['product asc']
                }
            };
            let dto = await order.toDto(strategy);
            console.log(dto);
        });
    } catch (e) {
        console.log(e.stack);
    }
}();