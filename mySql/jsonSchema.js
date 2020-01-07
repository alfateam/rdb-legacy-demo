let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let documentSchema = {
    "properties": {
        "foo": { "type": "number" },
        "bar": { "type": "number" }
    }
};

let nameSchema = {
    type: "string",
    "maxLength": 20
};

let Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name').JSONSchema(nameSchema);
Customer.column('cBalance').numeric().as('balance');
Customer.column('cDocument').json().as('document').JSONSchema(documentSchema, {allErrors: true});

let db = rdb('mysql://root@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let customer = await Customer.getById('a0000000-0000-0000-0000-000000000000');
            customer.name = 'Ringo Starr' //OK
            customer.document = {foo: 'not a number', bar: 'invalid'}; //violates schema
        });
    } catch (e) {
        console.log(e.stack);
        console.log(e.errors);
    // [ {  keyword: 'type',
    //      dataPath: '.foo',
    //      schemaPath: '#/properties/foo/type',
    //      params: { type: 'number' },
    //      message: 'should be number' },
    //  {   keyword: 'type',
    //      dataPath: '.bar',
    //      schemaPath: '#/properties/bar/type',
    //      params: { type: 'number' },
    //      message: 'should be number' } ]
    }
}();