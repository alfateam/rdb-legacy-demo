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
            let john = Customer.name.equal('John');
            let yoko = Customer.name.equal('Yoko');
            let filter = john.or(yoko);
            let customers = await Customer.getMany(filter);
            console.log(customers);
        });
    } catch (e) {
        console.log(e.stack);
    }
}();