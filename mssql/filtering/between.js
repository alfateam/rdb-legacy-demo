let rdb = require('rdb');
let resetDemo = require('../db/resetDemo');

let Customer = rdb.table('_customer');

Customer.primaryColumn('id').guid();
Customer.column('isActive').boolean();
Customer.column('balance').numeric();
Customer.column('name').string();

let db = rdb.mssql('server=.;Database=rdbDemo;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let filter = Customer.balance.between(3000, 8123);
            let customers = await Customer.getMany(filter);
            console.log(customers);
        });
    } catch (e) {
        console.log(e.stack);
    }
}();