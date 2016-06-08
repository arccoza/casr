'use strict'
var PouchDB = require('pouchdb');
var express = require('express');
var bodyParser = require('body-parser');
var User = require('./lib/users').User;
var Users = require('./lib/users').Users;
var pouchPlugs = require('./lib/pouch-plugins');


PouchDB.debug.enable('*');
PouchDB.plugin(pouchPlugs);



// PouchDB.plugin(require('pouchdb-authentication'));
// PouchDB.plugin(require('pouchdb-auth'));
// PouchDB.plugin(require('pouchdb-security'));
var remote = 'https://arccoza.cloudant.com/_users';
var opts = {
    skipSetup: true,
    auth: {
      // username: 'dautherhybertilsevandeve',
      // password: '2268b00792833903a4e6a76fb567e7fa04cdc683'
      username: 'arccoza',
      password: 'carbonscape'
      // username: 'bob',
      // password: 'bob'
    }
  };
var db = new PouchDB(remote, opts);

// var users = new Users(db, {
//   auth: {
//     username: 'arccoza',
//     password: 'carbonscape'
//   }
// });

// console.log(db.type())
// db.info()
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))

// db.putSecurity(users._securityObjTmpl)
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))

// db.put({_id: 'sdfasdf', foo: 'bar'})
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))

// users.addUserDb({name: 'jin'})
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))

// db.enableSessions().get()
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))
//   .then(res => db.enableSessions())
//   .then(res => res.rem())
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))


// users.get('jin')
//   .then(res => users.rem(res))
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))

// users.add(new User({
//   name: 'jin',
//   password: 'jin'
// }))
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))

// db.enablePermissions().get()
//   // .then(res => {
//   //   res.add('admins', 'roles', 'supers');
//   //   return db.permissions.put(res);
//   // })
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))
//   .then(res => {
//     return db.permissions.add('admins', 'names', 'jingo')
//   })
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))

// db.users().get('jin')
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))

// db.users().add({
//   name: 'gin',
//   password: 'gin'
// })
//   .then(res => {
//     console.log(res);
//     console.log(res.uid);
//   })
//   .catch(console.log.bind(console))


// var _users = db.use('_users');
// var get = _users.get.bind(_users);

// get('org.couchdb.user:bob')
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))


// db.stores().rem('userdb', toHex('sam'))
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))

// db.stores().add('sam')
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))


var users = db.users();
var stores = db.stores();
var toHex = db.stores().toHex;


var app = express();
app.set('view engine', 'jade')
  .use(express.static('pub'));

app
  .get('/', function (req, res) {
    res.render('index.jade')
  })
  .get('/login', function (req, res) {
    res.render('login.jade')
  })
  .get('/users/:id', function (req, res) {
    // console.log(req.params, req.body);
    res.json({ ok: true });
  })
  .put('/users/:id', bodyParser.json(), function (req, res) {
    // console.log(req.params, req.body);
    res.json([{ ok: true }]);
  })
  .post('/users/_bulk_docs', bodyParser.json(), function (req, res) {
    console.log(req.params, req.body);
    res.json([{ ok: true }]);
  })
  .delete('/users/:id', function (req, res) {
    console.log(req.params, req.query, req.body);
    res.json({ ok: true });
  });

app.listen(8080, () => {
  // console.log('here')
  // var db2 = new PouchDB('http://localhost:8080/users', { skip_setup: true });
  // db2.users('users').add({name: 'sam', password: 'sam'})
  //   .then(console.log.bind(console))
  //   .catch(console.log.bind(console))

  // console.log(db2.getUrl())
});
