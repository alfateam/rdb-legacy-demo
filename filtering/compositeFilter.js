const resetDemo = require('../db/resetDemo');
const rdb = require('rdb');
const inspect = require('util').inspect;

const Order = rdb.table('_order');
const Customer = rdb.table('_customer');
const OrderLine = rdb.table('_orderLine');

Order.primaryColumn('oId').guid().as('id');
Order.column('oCustomerId').guid().as('customerId');
Order.column('oOrderNo').string().as('orderNo');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cIsActive').boolean().as('isActive');
Customer.column('cBalance').numeric().as('balance');
Customer.column('cName').string().as('name');

OrderLine.primaryColumn('lId').guid().as('id');
OrderLine.column('lOrderId').guid().as('orderId');
OrderLine.column('lProduct').string().as('product');

Order.join(Customer).by('oCustomerId').as('customer');

const line_order_relation = OrderLine.join(Order).by('lOrderId').as('order');
Order.hasMany(line_order_relation).as('lines');

const db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction();
        let isActive = Order.customer.isActive.eq(true);
        let didOrderCar = Order.lines.product.contains('car');
        let filter = isActive.and(didOrderCar);
        //alternatively rdb.filter.and(isActive).and(didOrderCar);
        let orders = await Order.getMany(filter);
        console.log(inspect(await orders.toDto(), false, 10));
        await rdb.commit();
        console.log('Waiting for connection pool to teardown....');
    } catch (e) {
        console.log(e.stack);
        rdb.rollback();
    }
}();