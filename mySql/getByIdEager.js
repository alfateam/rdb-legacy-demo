let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');
let inspect = require('util').inspect;

let Customer = rdb.table('_customer');
let Order = rdb.table('_order');

Customer.primaryColumn('id').guid();
Customer.column('name').string();

Order.primaryColumn('id').guid();
Order.column('orderNo').string();
Order.column('customerId').guid();
Order.join(Customer).by('customerId').as('customer');

let db = rdb('mysql://rdb:rdb@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let fetchingStrategy = { customer: null }; //alternatively: {customer : {}}
            let order = await Order.getById('a0000000-a000-0000-0000-000000000000', fetchingStrategy);
            console.log(await order.toDto());
            let customer = await order.customer;
            console.log(await customer.toDto());
        });
    } catch (e) {
        console.log(e.stack);
    }
}();