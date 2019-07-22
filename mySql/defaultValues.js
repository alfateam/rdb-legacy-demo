let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let buf = Buffer.from(10);
buf.write('\u00bd + \u00bc = \u00be', 0);

let Customer = rdb.table('_customer');

/*unless overridden, numeric is default 0,
string is default null,
guid is default null,
date is default null,
binary is default null,
boolean is default false,
json is default null
*/

Customer.primaryColumn('cId').guid().as('id').default(null);
Customer.column('cName').string().as('name').default('default name');
Customer.column('cBalance').numeric().as('balance').default(2000);
Customer.column('cRegdate').date().as('registeredDate').default(new Date());
Customer.column('cIsActive').boolean().as('isActive').default(true);
Customer.column('cPicture').binary().as('picture').default(buf);
Customer.column('cDocument').json().as('document').default({foo: true});

let db = rdb('mysql://root@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction();
        let customer = Customer.insert('abcdef02-0000-0000-0000-000000000000')
        console.log(await customer.toDto());
        await rdb.commit();
        console.log('Waiting for connection pool to teardown....');
    } catch (e) {
        console.log(e.stack);
        rdb.rollback();
    }
}();