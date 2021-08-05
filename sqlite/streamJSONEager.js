let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Order = rdb.table('_order');
let OrderLine = rdb.table('_orderLine');

Order.primaryColumn('id').guid();
Order.column('orderNo').string();

OrderLine.primaryColumn('id').guid();
OrderLine.column('orderId').guid();
OrderLine.column('product').string();

let line_order_relation = OrderLine.join(Order).by('orderId').as('order');
Order.hasMany(line_order_relation).as('lines');

let db = rdb.sqlite(__dirname + '/db/rdbDemo');

module.exports = async function() {
	try {
		await resetDemo();
		let emptyFilter;
		let strategy = {
			lines: {
				orderBy: ['product']
			},
			orderBy: ['orderNo'],
			limit: 5,
		};
		Order.createJSONReadStream(db, emptyFilter, strategy).pipe(process.stdout);
	} catch (e) {
		console.log(e.stack);
	}
}();