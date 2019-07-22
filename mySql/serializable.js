let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let User = rdb.table('_user');
User.primaryColumn('uId').guid().as('id');
User.column('uUserId').string().as('userId');
User.column('uPassword').string().as('password').serializable(false);
User.column('uEmail').string().as('email');

let db = rdb('mysql://root@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction();
        let user = await User.getById('87654400-0000-0000-0000-000000000000');
        console.log(await user.toDto());
        //will print all properties except password
        //because it is not serializable
        await rdb.commit();
        console.log('Waiting for connection pool to teardown....');
    } catch (e) {
        console.log(e.stack);
        rdb.rollback();
    }
}();