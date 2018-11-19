const rdb = require('rdb');
const resetDemo = require('./db/resetDemo');

const db = rdb('postgres://rdb:rdb@localhost/rdbdemo');
//alternatively: var db = rdb.pg('postgres://postgres:postgres@localhost/test');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction();
        await db.schema({schema: ['mySchema', 'otherSchema']});
        //or use string for single schema );
        await rdb.commit();
        console.log('Waiting for connection pool to teardown....');
    } catch (e) {
        console.log(e.stack);
        rdb.rollback();
    }
}();