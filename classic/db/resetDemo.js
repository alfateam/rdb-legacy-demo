let fs = require('fs');
let promise = require('promise/domains');
let conString = require('./connectionString');
let pg = require('pg');

//var drop = "DROP TABLE IF EXISTS _compositeOrderLine;DROP TABLE IF EXISTS _compositeOrder;DROP TABLE IF EXISTS _deliveryAddress;DROP TABLE IF EXISTS _orderLine;DROP TABLE IF EXISTS _order;DROP TABLE IF EXISTS _customer;"
//sudo su postgres
//psql
//alter role rdb with superuser;
var drop = 'drop schema public cascade;create schema public;'
var createCustomer = "CREATE TABLE _customer (id uuid PRIMARY KEY, name varchar(40), balance numeric, regDate timestamp with time zone, isActive boolean, picture bytea, document JSON);"
var createUser = "CREATE TABLE _user (id uuid PRIMARY KEY, userId varchar(40), password varchar(40), email varchar(100));"
var createOrder = "CREATE TABLE _order (id uuid PRIMARY KEY, orderNo varchar(20), customerId uuid  REFERENCES _customer);"
var createOrderLine = "CREATE TABLE _orderLine (id uuid PRIMARY KEY, orderId uuid REFERENCES _order, product varchar(40));"
var createCompositeOrder = "CREATE TABLE _compositeOrder (companyId numeric, orderNo numeric, customerId uuid  REFERENCES _customer, PRIMARY KEY (companyId,orderNo));";
var createCompositeOrderLine = "CREATE TABLE _compositeOrderLine (companyId numeric, orderNo numeric, lineNo numeric, product varchar(40), PRIMARY KEY (companyId,orderNo, lineNo));";
var createDeliveryAddress = "CREATE TABLE _deliveryAddress (id uuid PRIMARY KEY, orderId uuid REFERENCES _order, name varchar(100), street varchar(200), postalCode varchar(50), postalPlace varchar(200), countryCode varchar(2), country varchar(100));";
var createJsonOrder = "CREATE TABLE _jOrder (id uuid PRIMARY KEY, oData jsonb);"

var createSql = drop + createCustomer + createOrder + createOrderLine + createDeliveryAddress + createCompositeOrder +  createCompositeOrderLine + createUser + createJsonOrder;
var buffer;
var buffer2;

createBuffers();

let insertCustomer1 = "INSERT INTO _customer VALUES ('a0000000-0000-0000-0000-000000000000','George',177,'2003-04-12 04:05:06 z',false," + buffer +  ", '[\"foo\", 1, {\"bar\": true}]');";
let insertCustomer2 = "INSERT INTO _customer VALUES ('b0000000-0000-0000-0000-000000000000','John',3045,'2014-05-11 06:49:40.297-0200',true," + buffer2 +  ",null);";
let insertCustomer3 = "INSERT INTO _customer VALUES ('12345678-0000-0000-0000-000000000000','Yoko',8765,'2012-02-10 07:00:40.297-0200',false," + buffer2 +  ",null);";
let insertCustomer4 = "INSERT INTO _customer VALUES ('87654321-0000-0000-0000-000000000000','Johnny',8123,'2011-03-11 06:00:40.297-0200',true," + buffer2 +  ",null);";
let insertCustomer5 = "INSERT INTO _customer VALUES ('87654399-0000-0000-0000-000000000000','Paul',8125,'2011-04-11 06:00:40.297-0200',true," + buffer2 +  ",null);";
let insertCustomers = insertCustomer1 + insertCustomer2 + insertCustomer3 + insertCustomer4 + insertCustomer5;

let insertUser1 = "INSERT INTO _user VALUES ('87654400-0000-0000-0000-000000000000','paul','secretPassword','paul@mccartney.net');";
let insertUser2 = "INSERT INTO _user VALUES ('97654400-0000-0000-0000-000000000000','john','myPassword','john@lennon.net');";
let insertUsers = insertUser1 + insertUser2;

let insertOrders =
    "INSERT INTO _order VALUES ('a0000000-a000-0000-0000-000000000000','1000', 'a0000000-0000-0000-0000-000000000000');" +
    "INSERT INTO _order VALUES ('b0000000-b000-0000-0000-000000000000','1001', 'b0000000-0000-0000-0000-000000000000');" +
    "INSERT INTO _order VALUES ('c0000000-c000-0000-0000-000000000000','1002', null);" +
    "INSERT INTO _order VALUES ('b0000000-d000-0000-0000-000000000000','1003', '87654399-0000-0000-0000-000000000000');" +
    "INSERT INTO _order VALUES ('d0000000-e000-0000-0000-000000000000','1004', 'a0000000-0000-0000-0000-000000000000');" +
    "INSERT INTO _compositeOrder VALUES (1,1001, null);";
let insertOrderLines =
    "INSERT INTO _orderLine VALUES ('a0000000-a000-1000-0000-000000000000','a0000000-a000-0000-0000-000000000000','Bicycle');" +
    "INSERT INTO _orderLine VALUES ('a0000000-a000-1001-0000-000000000000','a0000000-a000-0000-0000-000000000000','A small car');" +
    "INSERT INTO _orderLine VALUES ('a0000000-a000-2000-0000-000000000000','a0000000-a000-0000-0000-000000000000','Skateboard');" +
    "INSERT INTO _orderLine VALUES ('b0000000-b000-1000-0000-000000000000','b0000000-b000-0000-0000-000000000000','Climbing gear');" +
    "INSERT INTO _orderLine VALUES ('b0000000-b000-2000-0000-000000000000','b0000000-b000-0000-0000-000000000000','Hiking shoes');" +
    "INSERT INTO _orderLine VALUES ('b0000000-b000-3000-0000-000000000000','b0000000-b000-0000-0000-000000000000','A big car');" +
    "INSERT INTO _orderLine VALUES ('b0000000-b000-3100-0000-000000000000','b0000000-d000-0000-0000-000000000000','A yellow submarine');" +
    "INSERT INTO _compositeOrderLine VALUES (1,1001,1,'Free lunch');" +
    "INSERT INTO _compositeOrderLine VALUES (1,1001,2,'Guide to the galaxy');";
var insertDeliveryAddress = "INSERT INTO _deliveryAddress values ('dddddddd-0000-0000-0000-000000000000','b0000000-b000-0000-0000-000000000000', 'Lars-Erik Roald', 'Node Street 1', '7030', 'Trondheim', 'NO', 'Norway');"

var insertJsonOrders =
    "INSERT INTO _jOrder VALUES ('a0000000-a000-0000-0000-000000000000','{\"orderNo\":1000, \"customerId\":\"a0000000-0000-0000-0000-000000000000\"}');" +
    "INSERT INTO _jOrder VALUES ('b0000000-b000-0000-0000-000000000000','{\"orderNo\":1001, \"customerId\":\"b0000000-0000-0000-0000-000000000000\"}');" +
    "INSERT INTO _jOrder VALUES ('c0000000-c000-0000-0000-000000000000','{\"orderNo\":200, \"customerId\":null}');" +
    "INSERT INTO _jOrder VALUES ('b0000000-d000-0000-0000-000000000000','{\"orderNo\":1003, \"customerId\":\"87654399-0000-0000-0000-000000000000\"}');" +
    "INSERT INTO _jOrder VALUES ('d0000000-e000-0000-0000-000000000000','{\"orderNo\":1004, \"customerId\":\"a0000000-0000-0000-0000-000000000000\"}');" ;

var insertSql = insertCustomers + insertOrders + insertOrderLines + insertDeliveryAddress + insertUsers + insertJsonOrders;

function createBuffers() {
    buffer = newBuffer([1, 2, 3]);
    buffer2 = newBuffer([4, 5]);

    function newBuffer(contents) {
        let buffer = Buffer.from(contents);
        return "E'\\\\x" + buffer.toString('hex') + "'";
    }
}

function insert(onSuccess, onFailed) {
    let client = new pg.Client(conString);
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


let resetOnce = new promise(insert);
module.exports = function() {
    return resetOnce;
};