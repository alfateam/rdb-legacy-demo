let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let db = rdb('postgres://rdb:rdb@localhost/rdbdemo');
//alternatively: let db = rdb.pg('postgres://postgres:postgres@localhost/test');

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