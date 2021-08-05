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

Customer.primaryColumn('id').guid();
Customer.column('name').string().JSONSchema(nameSchema);
Customer.column('balance').numeric();
Customer.column('document').json().JSONSchema(documentSchema, {allErrors: true});

let db = rdb.sqlite(__dirname + '/db/rdbDemo');

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