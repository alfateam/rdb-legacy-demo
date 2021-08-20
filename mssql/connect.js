let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let db = rdb.mssql('server=.;Database=rdbDemo;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}');
rdb.log(console.log)
module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            //do stuff here
            //transaction will commit after this function
        });
    } catch (e) {
        console.log(e.stack);
    }
}();