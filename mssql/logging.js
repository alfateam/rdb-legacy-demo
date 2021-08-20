let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Customer = rdb.table('_customer');

Customer.primaryColumn('id').guid();
Customer.column('name').string();

rdb.log(console.log); //will log sql and parameters

let db = rdb.mssql('server=.;Database=rdbDemo;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let customer = await Customer.getById('a0000000-0000-0000-0000-000000000000');
            customer.name = 'Ringo';
        });
    } catch (e) {
        console.log(e.stack);
    }
}();
