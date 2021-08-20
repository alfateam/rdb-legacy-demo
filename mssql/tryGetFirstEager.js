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

let db = rdb.mssql('server=.;Database=rdbDemo;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let filter = Order.customer.name.equal('John');
            let strategy = { customer: null };
            let order = await Order.tryGetFirst(filter, strategy);
            console.log(order);
        });
    } catch (e) {
        console.log(e.stack);
    }
}();