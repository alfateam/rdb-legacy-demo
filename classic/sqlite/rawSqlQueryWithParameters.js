let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let db = rdb.sqlite(__dirname + '/db/rdbDemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let result = await rdb.query({
                sql: 'SELECT orderNo FROM _order WHERE orderNo LIKE ?',
                parameters: ['%04']
            });
            console.log(result);
        });
    } catch (e) {
        console.log(e.stack);
    }
}();