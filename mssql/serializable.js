let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let User = rdb.table('_user');
User.primaryColumn('id').guid();
User.column('userId').string();
User.column('password').string().serializable(false);
User.column('email').string();

let db = rdb.mssql('server=.;Database=rdbDemo;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}');
rdb.log(console.log)
module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let user = await User.getById('87654400-0000-0000-0000-000000000000');
            console.log(user);
            //will print all properties except password
            //because it is not serializable
        });
    } catch (e) {
        console.log(e.stack);
    }
}();