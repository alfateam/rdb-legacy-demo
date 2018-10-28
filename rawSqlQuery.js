const rdb = require('rdb');
const resetDemo = require('./db/resetDemo');

const db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction();
        let result = await rdb.query('SELECT DISTINCT oCustomerId AS "customerId" FROM _order');
        console.log(result);
        await rdb.commit();
        console.log('Waiting for connection pool to teardown....');
    } catch (e) {
        console.log(e.stack);
        rdb.rollback();
    }
}();