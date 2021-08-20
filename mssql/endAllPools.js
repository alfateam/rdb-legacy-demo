let rdb = require('rdb');

let dbSqlite = rdb.sqlite(__dirname + '/db/rdbDemo');
let dbMssql = rdb.mssql('server=.;Database=rdbDemo;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}');

module.exports = async function () {
    try {
        await dbSqlite.transaction(async () => {
            //do mySql stuff here
        });
        await dbMssql.transaction(async () => {
            //do sqlite stuff here
        });
        await rdb.end();
        console.log('Pools ended.');
    } catch (e) {
        console.log(e.stack);
    }
}();