let rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

let Order = rdb.table('_jOrder');

Order.primaryColumn('oId').guid().as('id');
Order.column('oData').json().as('data');

let db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {

        await resetDemo();
        await db.transaction(async () => {
            let strategy = {
                orderBy: ['data->\'orderNo\'']
                //alternative: orderBy: ['data->>\'orderId\' asc']
            };
            let orders = await Order.getMany(null, strategy);
            let dtos = await orders.toDto();
            console.log(dtos);
        });
    }
    catch (e) {
        console.log(e.stack);
    }
}();