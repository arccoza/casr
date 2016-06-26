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
    skip_setup: true,
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

// db.sessions().get()
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))
//   .then(res => db.enableSessions())
//   .then(res => res.rem())
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))

// db.sessions().add('jin', 'jin')
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))

// db.sessions().rem()
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))

// db.users().add({name: 'jin', password: 'jin'})
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


var users = null;
var stores = null;
var toHex = null;
var casrDb = null;

function initDb() {
  users = db.users();
  stores = db.stores();
  toHex = db.stores().toHex;

  casrDb = db.use('casr_store', Object.assign({}, opts, { skip_setup: false }));
  casrDb.get('')
    .then(rep => casrDb.permissions().add('admins', { roles: ['admins'] }))
    .then(console.log.bind(console))
    .catch(console.log.bind(console))
}

initDb();

var app = express();
app.set('view engine', 'jade')
  .use(express.static('pub'));

app
  .get('/', function (req, res) {
    res.render('index.jade')
  })
  .get('/app*', function (req, res) {
    res.render('app.jade');
  })
  .get('/users/:id', function (req, res) {
    users.get(req.params.id)
      .then(rep => res.json(rep))
      .catch(err => res.status(err.status).json(err));
  })
  // .put('/users/:id', bodyParser.json(), function (req, res) {
  //   // console.log(req.params, req.body);
  //   res.json([{ ok: true }]);
  // })
  .post('/users/_bulk_docs', bodyParser.json(), function (req, res) {
    var user = {};

    users.add(req.body.docs[0])
      .then(rep => {
        user = rep;
        console.log('add user: \n', rep)
        return stores.add(rep);
      })
      .then(rep => {
        console.log('add store: \n', rep);
        return rep.store.permissions().add('admins', { roles: [user.uid, 'admins'] });
      })
      .then(rep => {
        console.log('set permissions: \n', rep);
        return res.json([user]);
      })
      .catch(err => {
        console.log(err);
        return res.status(err.status).json([err])
      });
  })
  .delete('/users/:id', function (req, res) {
    // users.rem({ _id: req.params.id, _rev: req.query.rev })
    //   .then(rep => res.json(rep))
    //   .catch(err => res.status(err.status).json(err));
    var user = {};

    users.get(req.params.id)
      .then(rep => {
        user = rep;
        return stores.rem(user);
      })
      .then(rep => {
        return users.rem(user);
      })
      .then(rep => res.json(rep))
      .catch(err => res.status(err.status).json(err));
  });

app.listen(8080, () => {
  // console.log('here')
  // var db2 = new PouchDB('http://localhost:8080/users', { skip_setup: true });
  // db2.users('users').add({name: 'sam', password: 'sam'})
  //   .then(console.log.bind(console))
  //   .catch(console.log.bind(console))

  // console.log(db2.getUrl())
});
