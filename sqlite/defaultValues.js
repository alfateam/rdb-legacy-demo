let rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

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


let db = rdb.sqlite(__dirname + '/db/rdbDemo');

module.exports = resetDemo()
    .then(db.transaction)
    .then(insert)
    .then(print)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function insert() {
    let customer = Customer.insert('abcdef02-0000-0000-0000-000000000000')
    return customer.toJSON();
}

function print(json) {
    console.log(json);
}

function onOk() {
    console.log('Success');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err);
}