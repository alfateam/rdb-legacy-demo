let rdb = require('rdb');
let resetDemo = require('../db/resetDemo');

let Customer = rdb.table('_customer');

Customer.primaryColumn('id').guid();
Customer.column('name').string();

let db = rdb.mssql('server=.;Database=rdbDemo;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let filter = Customer.name.in(['John', 'Yoko']);
            let customers = await Customer.getMany(filter);
            console.log(customers);
        });
    } catch (e) {
        console.log(e.stack);
    }
}();