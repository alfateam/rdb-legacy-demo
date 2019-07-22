let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let db = rdb('mysql://root@localhost/rdbDemo?multipleStatements=true');
//alternatively: let db = rdb.mySql('mysql://root@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction();
        await rdb.commit();
        console.log('Waiting for connection pool to teardown....');
    } catch (e) {
        console.log(e.stack);
        rdb.rollback();
    }
}();