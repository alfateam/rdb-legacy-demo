let rdb = require('rdb');

let dbPg = rdb('postgres://rdb:rdb@localhost/rdbdemo');
let dbMySql = rdb('mysql://rdb:rdb@localhost/rdbDemo?multipleStatements=true');

module.exports = async function () {
    try {
        await dbPg.transaction(async () => {
            //do pg stuff here
        });
        await dbMySql.transaction(async () => {
            //do mySql stuff here
        });
        await rdb.end();
        console.log('Pools ended.');
    } catch (e) {
        console.log(e.stack);
    }
}();