import rdb from 'rdb-client'
let Order = rdb.table('http://localhost:8080/order');

run();

async function run() {
    let filter = Order.lines.product.greaterThan('');
    let orders = await Order.getMany(filter);
    console.log(orders);
}