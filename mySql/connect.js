const rdb = require('rdb');
const resetDemo = require('./db/resetDemo');

const db = rdb('mysql://root@localhost/rdbDemo?multipleStatements=true');
//alternatively: var db = rdb.mySql('mysql://root@localhost/rdbDemo?multipleStatements=true');

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