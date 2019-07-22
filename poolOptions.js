const rdb = require('rdb');
const resetDemo = require('./db/resetDemo');
const poolOptions = {size: 20};

const db = rdb('postgres://rdb:rdb@localhost/rdbdemo', poolOptions);

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