let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let db = rdb('mysql://rdb:rdb@localhost/rdbDemo?multipleStatements=true');
//alternatively: let db = rdb.mySql('mysql://rdb:rdb@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            //transaction will commit after this function
        });
    } catch (e) {
        console.log(e.stack);
    }
}();