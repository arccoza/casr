var PouchDB = require('pouchdb');
var express = require('express');
var User = require('./lib/users').User;
var Users = require('./lib/users').Users;
var pouchPlugs = require('./lib/pouch-plugins');


PouchDB.debug.enable('*');
PouchDB.plugin(pouchPlugs);



// PouchDB.plugin(require('pouchdb-authentication'));
// PouchDB.plugin(require('pouchdb-auth'));
// PouchDB.plugin(require('pouchdb-security'));
var remote = 'https://arccoza.cloudant.com/userdb%2F626f62';
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

var users = new Users(db, {
  auth: {
    username: 'arccoza',
    password: 'carbonscape'
  }
});

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
//     return db.permissions.add('admins', 'names', 'adrien')
//   })
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))





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
  .post('/register', function (req, res) {
    res.render('login.jade')
  });

app.listen(8080);
