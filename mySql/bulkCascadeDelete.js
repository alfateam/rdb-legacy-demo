let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Customer = rdb.table('_customer');
let Order = rdb.table('_order');
let OrderLine = rdb.table('_orderLine');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');

Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');
Order.column('oCustomerId').guid().as('customerId');

OrderLine.primaryColumn('lId').guid().as('id');
OrderLine.column('lOrderId').guid().as('orderId');

let orderToCustomer = Order.join(Customer).by('oCustomerId').as('customer');
Customer.hasMany(orderToCustomer).as('orders');

let line_order_relation = OrderLine.join(Order).by('lOrderId').as('order');
Order.hasMany(line_order_relation).as('lines');

let db = rdb('mysql://rdb:rdb@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let filter = Customer.id.eq('87654399-0000-0000-0000-000000000000');
            await Customer.cascadeDelete(filter);
        });
    } catch (e) {
        console.log(e.stack);
    }
}();