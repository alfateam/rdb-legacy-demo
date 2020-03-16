let createPatch = require('./createPatch');
let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');
Customer.column('cBalance').numeric().as('balance');
Customer.column('cRegdate').date().as('registeredDate');
Customer.column('cIsActive').boolean().as('isActive');
Customer.column('cPicture').binary().as('picture');
Customer.column('cDocument').json().as('document');

let db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let filter = Customer.id.eq('a0000000-0000-0000-0000-000000000000');
            let original = await Customer.getManyDto(filter);
            let customers = JSON.parse(JSON.stringify(original));
            customers[0].name = 'Ringo';
            customers[0].balance = 32;
            customers[0].registeredDate = undefined;
            customers[0].document[2].bar = 'bar changed';

            let patch = createPatch(original, customers);
            console.log(patch)
            await Customer.patch(patch);

            customers = await Customer.getManyDto(filter);
            console.log(customers[0])
        });
    } catch (e) {
        console.log(e.stack);
    }
}();