let rdb = require('rdb');

let dbPg = rdb('postgres://rdb:rdb@localhost/rdbdemo');
let dbMySql = rdb('mysql://rdb:rdb@localhost/rdbDemo?multipleStatements=true');
let dbSqlite = rdb.sqlite(__dirname + '/db/rdbDemo');

module.exports = async function () {
    try {
        await dbPg.transaction(async () => {
            //do pg stuff here
        });
        await dbMySql.transaction(async () => {
            //do mySql stuff here
        });
        await dbSqlite.transaction(async () => {
            //do sqlite stuff here
        });
        await rdb.end();
        console.log('Pools ended.');
    } catch (e) {
        console.log(e.stack);
    }
}();