let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Customer = rdb.table('_customer');

Customer.primaryColumn('id').guid();
Customer.column('name').string();

let db = rdb.mssql('server=.;Database=rdbDemo;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            rdb.log(console.log)
            let id = 'abcdef00-0000-0000-0000-000000000000'
            let customer = await Customer.insert(id)
            customer.name = 'Paul';
            customer = await Customer.getById(id);
            console.log(customer);
        });
    } catch (e) {
        console.log(e.stack);
    }
}();
