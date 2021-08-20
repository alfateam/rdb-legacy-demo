let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let db = rdb.mssql('server=.;Database=rdbDemo;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            //transaction will commit after this function
        });
        await db.end();
        console.log('Pool ended.');
    } catch (e) {
        console.log(e.stack);
    }
}();