let resetDemo = require('../db/resetDemo');
let rdb = require('rdb');
let inspect = require('util').inspect;

let Order = rdb.table('_order');
let Customer = rdb.table('_customer');
let OrderLine = rdb.table('_orderLine');

Order.primaryColumn('id').guid();
Order.column('customerId').guid();
Order.column('orderNo').string();

Customer.primaryColumn('id').guid();
Customer.column('isActive').boolean();
Customer.column('balance').numeric();
Customer.column('name').string();

OrderLine.primaryColumn('id').guid();
OrderLine.column('orderId').guid();
OrderLine.column('product').string();

Order.join(Customer).by('customerId').as('customer');

let line_order_relation = OrderLine.join(Order).by('orderId').as('order');
Order.hasMany(line_order_relation).as('lines');

let db = rdb.sqlite(__dirname + '/../db/rdbDemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let isActive = Order.customer.isActive.eq(true);
            let didOrderCar = Order.lines.product.contains('car');
            let filter = isActive.and(didOrderCar);
            //alternatively rdb.filter.and(isActive).and(didOrderCar);
            let orders = await Order.getMany(filter);
            console.log(inspect(await orders.toDto(), false, 10));
        });
    } catch (e) {
        console.log(e.stack);
    }
}();