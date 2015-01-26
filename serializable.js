var rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

var User = rdb.table('_user');
User.primaryColumn('uId').guid().as('id');
User.column('uUserId').string().as('userId');
User.column('uPassword').string().as('password').serializable(false);
User.column('uEmail').string().as('email');

var db = rdb('postgres://postgres:postgres@localhost/test');

module.exports = resetDemo()
    .then(db.transaction)
    .then(getUser)
    .then(toDto)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function getUser() {
    return User.getById('87654400-0000-0000-0000-000000000000');
}

function toDto(user) {
    return user.toDto().then(console.log);
    //will print all properties except password
    //because it is not serializable
}

function onOk() {
    console.log('Success');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err);
}