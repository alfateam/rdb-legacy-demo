let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Customer = rdb.table('_customer');

Customer.primaryColumn('id').guid();
Customer.column('name').string();
Customer.column('balance').numeric();
Customer.column('regDate').date().as('registeredDate');
Customer.column('isActive').boolean();
Customer.column('picture').binary();

let db = rdb.mssql('server=.;Database=rdbDemo;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let filter = Customer.id.eq('87654321-0000-0000-0000-000000000000');
            await Customer.delete(filter);
        });
    } catch (e) {
        console.log(e.stack);
    }
}();