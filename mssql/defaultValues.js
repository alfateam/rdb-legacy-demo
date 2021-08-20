let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let buf = Buffer.alloc(10);
buf.write('\u00bd + \u00bc = \u00be', 0);

let Customer = rdb.table('_customer');

/*unless overridden, primary key or part of relation, numeric is default 0,
string is default null,
guid is default null,
date is default null,
binary is default null,
boolean is default false,
json is default null
*/
rdb.log(console.log)
Customer.primaryColumn('id').guid().default(null);
Customer.column('name').string().default('default name');
Customer.column('balance').numeric().default(2000);
Customer.column('regDate').date().as('registeredDate').default(new Date());
Customer.column('isActive').boolean().default(true);
Customer.column('picture').binary().default(buf);
Customer.column('document').json().default({foo: true});

let db = rdb.mssql('server=.;Database=rdbDemo;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}');

module.exports = async function() {
    try {
        await resetDemo();
        rdb.log(console.log)
        await db.transaction(async () => {
            let customer = await Customer.insert('abcdef02-0000-0000-0000-000000000000')
            customer = await Customer.getById('abcdef02-0000-0000-0000-000000000000', {})
            console.log(customer);
        });
    } catch (e) {
        console.log(e.stack);
    }
}();