var fs = require('fs');
var promise = require('promise/domains');
var conString = require('./connectionString');
var pg = require('pg');
var mySql = require('mysql');

//var drop = "DROP TABLE IF EXISTS _compositeOrderLine;DROP TABLE IF EXISTS _compositeOrder;DROP TABLE IF EXISTS _deliveryAddress;DROP TABLE IF EXISTS _orderLine;DROP TABLE IF EXISTS _order;DROP TABLE IF EXISTS _customer;"
var drop = 'drop schema public cascade;create schema public;'
var createCustomer = "CREATE TABLE _customer (cId uuid PRIMARY KEY, cName varchar(40), cBalance numeric, cRegdate timestamp with time zone, cIsActive boolean, cPicture bytea, cDocument JSON);"
var createUser = "CREATE TABLE _user (uId uuid PRIMARY KEY, uUserId varchar(40), uPassword varchar(40), uEmail varchar(100));"
var createOrder = "CREATE TABLE _order (oId uuid PRIMARY KEY, oOrderNo varchar(20), oCustomerId uuid  REFERENCES _customer);"
var createOrderLine = "CREATE TABLE _orderLine (lId uuid PRIMARY KEY, lOrderId uuid REFERENCES _order, lProduct varchar(40));"
var createCompositeOrder = "CREATE TABLE _compositeOrder (oCompanyId numeric, oOrderNo numeric, oCustomerId uuid  REFERENCES _customer, PRIMARY KEY (oCompanyId,oOrderNo));";
var createCompositeOrderLine = "CREATE TABLE _compositeOrderLine (lCompanyId numeric, lOrderNo numeric, lLineNo numeric, lProduct varchar(40), PRIMARY KEY (lCompanyId,lOrderNo, lLineNo));";
var createDeliveryAddress = "CREATE TABLE _deliveryAddress (dId uuid PRIMARY KEY, dOrderId uuid REFERENCES _order, dName varchar(100), dStreet varchar(200), dPostalCode varchar(50), dPostalPlace varchar(200), dCountryCode varchar(2), dCountry varchar(100));";

var createSql = drop + createCustomer + createOrder + createOrderLine + createDeliveryAddress + createCompositeOrder +  createCompositeOrderLine + createUser;
var buffer;
var buffer2;

createBuffers();

var insertCustomer1 = "INSERT INTO _customer VALUES ('a0000000-0000-0000-0000-000000000000','George',177,'2003-04-12 04:05:06 z',false," + buffer +  ", '[\"foo\", 1, {\"bar\": true}]');";
var insertCustomer2 = "INSERT INTO _customer VALUES ('b0000000-0000-0000-0000-000000000000','John',3045,'2014-05-11 06:49:40.297-0200',true," + buffer2 +  ",null);";
var insertCustomer3 = "INSERT INTO _customer VALUES ('12345678-0000-0000-0000-000000000000','Yoko',8765,'2012-02-10 07:00:40.297-0200',false," + buffer2 +  ",null);";
var insertCustomer4 = "INSERT INTO _customer VALUES ('87654321-0000-0000-0000-000000000000','Johnny',8123,'2011-03-11 06:00:40.297-0200',true," + buffer2 +  ",null);";
var insertCustomer5 = "INSERT INTO _customer VALUES ('87654399-0000-0000-0000-000000000000','Paul',8125,'2011-04-11 06:00:40.297-0200',true," + buffer2 +  ",null);";
var insertCustomers = insertCustomer1 + insertCustomer2 + insertCustomer3 + insertCustomer4 + insertCustomer5;

var insertUser1 = "INSERT INTO _user VALUES ('87654400-0000-0000-0000-000000000000','paul','secretPassword','paul@mccartney.net');";
var insertUser2 = "INSERT INTO _user VALUES ('97654400-0000-0000-0000-000000000000','john','myPassword','john@lennon.net');";
var insertUsers = insertUser1 + insertUser2;

var insertOrders =
    "INSERT INTO _order VALUES ('a0000000-a000-0000-0000-000000000000','1000', 'a0000000-0000-0000-0000-000000000000');" +
    "INSERT INTO _order VALUES ('b0000000-b000-0000-0000-000000000000','1001', 'b0000000-0000-0000-0000-000000000000');" +
    "INSERT INTO _order VALUES ('c0000000-c000-0000-0000-000000000000','1002', null);" + 
    "INSERT INTO _order VALUES ('b0000000-d000-0000-0000-000000000000','1003', '87654399-0000-0000-0000-000000000000');" +
    "INSERT INTO _order VALUES ('d0000000-e000-0000-0000-000000000000','1004', 'a0000000-0000-0000-0000-000000000000');" +
    "INSERT INTO _compositeOrder VALUES (1,1001, null);";
var insertOrderLines =
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
    
var insertSql = insertCustomers + insertOrders + insertOrderLines + insertDeliveryAddress + insertUsers;

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


var resetOnce = new promise(insert);
module.exports = function() {
    return resetOnce;
};