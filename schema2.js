const rdb = require('rdb');
const resetDemo = require('./db/resetDemo');

const db = rdb('postgres://rdb:rdb@localhost/rdbdemo');
//alternatively: var db = rdb.pg('postgres://postgres:postgres@localhost/test');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            await db.schema({schema: ['mySchema', 'otherSchema']});
            //or use string for single schema );
        });
    } catch (e) {
        console.log(e.stack);
    }
}();