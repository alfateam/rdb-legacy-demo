const rdb = require('rdb');

const db = rdb('mysql://root@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await db.transaction();
        await rdb.commit();
    	await db.end();
        console.log('Pool ended.');
    } catch (e) {
        console.log(e.stack);
        rdb.rollback();
    }
}();