let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Customer = rdb.table('_customer');
let Order = rdb.table('_order');

Customer.primaryColumn('id').guid();
Customer.column('name').string();

Order.primaryColumn('id').guid();
Order.column('orderNo').string();
Order.column('customerId').guid();

Order.join(Customer).by('customerId').as('customer');

let db = rdb.sqlite(__dirname + '/db/rdbDemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let order = await Order.getById('b0000000-b000-0000-0000-000000000000');
            let yokoId = '12345678-0000-0000-0000-000000000000';
            order.customerId = yokoId;
            let customer = await order.customer;
            console.log(customer.name);
        });
    } catch (e) {
        console.log(e.stack);
    }
}();