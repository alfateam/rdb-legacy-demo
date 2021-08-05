let rdb = require('rdb');
let resetDemo = require('../db/resetDemo');

let Order = rdb.table('_order');
Order.primaryColumn('id').guid();
Order.column('orderNo').string();
Order.column('customerId').guid();

let Customer = rdb.table('_customer');
Customer.primaryColumn('id').guid();
Customer.column('name').string();
Customer.column('balance').string();
Customer.column('isActive').boolean();

let orderCustomerJoin = Order.join(Customer).by('customerId').as('customer');
Customer.hasMany(orderCustomerJoin).as('orders');

let db = rdb('mysql://rdb:rdb@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let filter = {
                sql: 'exists (select 1 from _customer where _customer.id = customerId and _customer.balance > 3000 and _customer.name LIKE ?)',
                parameters: ['%o%']
            };
            let orders = await Order.getMany(filter);
            let strategy = { customer: null }
            console.log(await orders.toDto(strategy));
        });
    } catch (e) {
        console.log(e.stack);
    }
}();