let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Customer = rdb.table('_customer');

Customer.primaryColumn('id').guid();
Customer.column('name').string().validate(validateName);

function validateName(value, row) {
    if (value && value.length > 10)
        throw new Error("Length cannot exceed 10 characters");
}

let db = rdb('mysql://rdb:rdb@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let customer = await Customer.getById('a0000000-0000-0000-0000-000000000000');
            customer.name = 'Ringo Starr' //11 Chars. Will throw
        });
    } catch (e) {
        console.log(e.message);
        //Length cannot exceed 10 characters
    }

}();