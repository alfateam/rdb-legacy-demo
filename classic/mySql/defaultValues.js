let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let buf = Buffer.alloc(10);
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

Customer.primaryColumn('id').guid().default(null);
Customer.column('name').string().default('default name');
Customer.column('balance').numeric().default(2000);
Customer.column('regDate').date().as('registeredDate').default(new Date());
Customer.column('isActive').boolean().default(true);
Customer.column('picture').binary().default(buf);
Customer.column('document').json().default({foo: true});

let db = rdb('mysql://rdb:rdb@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let customer = Customer.insert('abcdef02-0000-0000-0000-000000000000')
            console.log(customer);
        });
    } catch (e) {
        console.log(e.stack);
    }
}();