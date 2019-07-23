let resetDemo = require('../db/resetDemo');
let rdb = require('rdb');
let inspect = require('util').inspect;

let Order = rdb.table('_order');
let Customer = rdb.table('_customer');
let OrderLine = rdb.table('_orderLine');

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

let line_order_relation = OrderLine.join(Order).by('lOrderId').as('order');
Order.hasMany(line_order_relation).as('lines');

let db = rdb('mysql://root@localhost/rdbDemo?multipleStatements=true');

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