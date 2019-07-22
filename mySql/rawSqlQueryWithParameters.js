let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let db = rdb('mysql://root@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction();
        let result = await rdb.query({
            sql: 'SELECT oOrderNo AS "orderNo" FROM _order WHERE oOrderNo LIKE ?',
            parameters: ['%04']
        });
        console.log(result);
        await rdb.commit();
        console.log('Waiting for connection pool to teardown....');
    } catch (e) {
        console.log(e.stack);
        rdb.rollback();
    }
}();