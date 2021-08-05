let rdb = require('rdb');
let resetDemo = require('../db/resetDemo');

let Customer = rdb.table('_customer');

Customer.primaryColumn('id').guid();
Customer.column('balance').numeric();
Customer.column('name').string();

let db = rdb('mysql://rdb:rdb@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let filter = Customer.balance.lessThanOrEqual(8123);
            //same as Customer.balance.le(8123);
            let customers = await Customer.getMany(filter);
            console.log(await customers.toDto());
        });
    } catch (e) {
        console.log(e.stack);
    }
}();