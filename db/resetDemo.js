var fs = require('fs');
var Promise = require('promise');
var conString = require('./connectionString');
var pg = require('pg.js');

var drop = "DROP TABLE IF EXISTS _deliveryAddress;DROP TABLE IF EXISTS _orderLine;DROP TABLE IF EXISTS _order;DROP TABLE IF EXISTS _customer;"
var createCustomer = "CREATE TABLE _customer (cId uuid PRIMARY KEY, cName varchar(40), cBalance numeric, cRegdate timestamp with time zone, cIsActive boolean, cPicture bytea);"
var createOrder = "CREATE TABLE _order (oId uuid PRIMARY KEY, oOrderNo varchar(20), oCustomerId uuid  REFERENCES _customer);"
var createOrderLine = "CREATE TABLE _orderLine (lId uuid PRIMARY KEY, lOrderId uuid REFERENCES _order, lProduct varchar(40));"
var createDeliveryAddress = "CREATE TABLE _deliveryAddress (dId uuid PRIMARY KEY, dOrderId uuid REFERENCES _order, dName varchar(100), dStreet varchar(200), dPostalCode varchar(50), dPostalPlace varchar(200), dCountryCode varchar(2), dCountry varchar(100));"

var createSql = drop + createCustomer + createOrder + createOrderLine + createDeliveryAddress;
var buffer;
var buffer2;

createBuffers();

var insertCustomer1 = "INSERT INTO _customer VALUES ('a0000000-0000-0000-0000-000000000000','George',177,'2003-04-12 04:05:06 z',false," + buffer +  ");",
    insertCustomer2 = "INSERT INTO _customer VALUES ('b0000000-0000-0000-0000-000000000000','John',3045,'2014-05-11 06:49:40.297-0200',true," + buffer2 +  ");";
    insertCustomer3 = "INSERT INTO _customer VALUES ('12345678-0000-0000-0000-000000000000','Yoko',8765,'2018-02-10 07:00:40.297-0200',true," + buffer2 +  ");";
    insertCustomers = insertCustomer1 + insertCustomer2 + insertCustomer3;
var insertOrders =
    "INSERT INTO _order VALUES ('a0000000-a000-0000-0000-000000000000','1000', 'a0000000-0000-0000-0000-000000000000');" +
    "INSERT INTO _order VALUES ('b0000000-b000-0000-0000-000000000000','1001', 'b0000000-0000-0000-0000-000000000000');";
var insertOrderLines =
    "INSERT INTO _orderLine VALUES ('a0000000-a000-1000-0000-000000000000','a0000000-a000-0000-0000-000000000000','Bicycle');" +
    "INSERT INTO _orderLine VALUES ('a0000000-a000-2000-0000-000000000000','a0000000-a000-0000-0000-000000000000','Skateboard');" +
    "INSERT INTO _orderLine VALUES ('b0000000-b000-1000-0000-000000000000','b0000000-b000-0000-0000-000000000000','Climbing gear');" +
    "INSERT INTO _orderLine VALUES ('b0000000-b000-2000-0000-000000000000','b0000000-b000-0000-0000-000000000000','Hiking shoes');" +
    "INSERT INTO _orderLine VALUES ('b0000000-b000-3000-0000-000000000000','b0000000-b000-0000-0000-000000000000','A big car');";
var insertDeliveryAddress = "INSERT INTO _deliveryAddress values ('dddddddd-0000-0000-0000-000000000000','b0000000-b000-0000-0000-000000000000', 'Lars-Erik Roald', 'Node Street 1', '7030', 'Trondheim', 'NO', 'Norway');"
    
var insertSql = insertCustomers + insertOrders + insertOrderLines + insertDeliveryAddress;

function createBuffers() {
    buffer = newBuffer([1, 2, 3]);
    buffer2 = newBuffer([4, 5]);

    function newBuffer(contents) {
        var buffer = new Buffer(contents);
        return "E'\\\\x" + buffer.toString('hex') + "'";
    }
}

function insert(onSuccess, onFailed) {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if (err) {
            console.log('Error while connecting: ' + err);
            onFailed(err);
            return;
        }
        client.query(createSql + insertSql, onInserted);

        function onInserted(err, result) {
            client.end();
            if (err) {
                console.error('error running query', err);
                onFailed(err);
                return;
            }
            onSuccess();
        }
    });
}


var resetOnce = new Promise(insert);
module.exports = function() {
    return resetOnce;
};