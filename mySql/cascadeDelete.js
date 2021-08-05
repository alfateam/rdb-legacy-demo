let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Customer = rdb.table('_customer');
let Order = rdb.table('_order');
let OrderLine = rdb.table('_orderLine');

Customer.primaryColumn('id').guid();
Customer.column('name').string();

Order.primaryColumn('id').guid();
Order.column('orderNo').string();
Order.column('customerId').guid();

OrderLine.primaryColumn('id').guid();
OrderLine.column('orderId').guid();

let orderToCustomer = Order.join(Customer).by('customerId').as('customer');
Customer.hasMany(orderToCustomer).as('orders');

let line_order_relation = OrderLine.join(Order).by('orderId').as('order');
Order.hasMany(line_order_relation).as('lines');


let db = rdb('mysql://rdb:rdb@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let customer = await Customer.getById('87654399-0000-0000-0000-000000000000');
            await customer.cascadeDelete();
        });
    } catch (e) {
        console.log(e.stack);
    }
}();