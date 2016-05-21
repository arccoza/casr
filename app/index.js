var PouchDB = require('pouchdb');
var express = require('express');
var User = require('./lib/users').User;
var Users = require('./lib/users').Users;


PouchDB.debug.enable('*');



// PouchDB.plugin(require('pouchdb-authentication'));
// PouchDB.plugin(require('pouchdb-auth'));
PouchDB.plugin(require('pouchdb-security'));
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

var users = new Users(db, {
  auth: {
    username: 'arccoza',
    password: 'carbonscape'
  }
});

users.register(new User({
  name: 'jim',
  password: 'jim'
}))
  // .then(console.log.bind(console))
  // .catch(console.log.bind(console))
// users.login('bob', 'bob')
  // .then(console.log.bind(console))
  // .catch(console.log.bind(console))
// users.session()
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))


// console.log(PouchDB.utils)


// 'org.couchdb.user:deanv'
// db.useAsAuthenticationDB({ isOnlineAuthDB: false })
//   .then(res => {
//     return db2.get('d647546531f85a7d57ba714c033c122e');
//   })
//   // .then(res => {
//   //   return db.session();
//   // })
//   .then(res => {
//     console.log(res);
//   })
//   .catch(console.log.bind(console))

// db.allDocs().then(res => {
//   console.log('[response] \n', res);
// }).catch(err => {
//   console.log('[error] \n', err);
// });

// var _sec = {
//   "_id": "_security",
//   "couchdb_auth_only": true,
//   "admins": {
//     "names": [""],
//     "roles": ["admins"]
//   },
//   "members": {
//     "names": [""],
//     "roles": ["clients"]
//   }
// }

// db.request({
//   method: 'PUT',
//   url: '_session',
//   body: {...}
// }).then(...);

// db.get('_security')
//   .then(res => {
//     console.log(res);
//     _sec = Object.assign(_sec, res);
//     console.log(_sec);

//     return db.putSecurity(_sec);
//   })
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => {
//     console.log(err);
//   })

// db.changes({
//     since: 'now',
//     live: true,
//     include_docs: true
//   }).on('change', function(change) {
//     console.log(change);
//   }).on('complete', function(info) {
//     console.log(info);
//   }).on('error', function (err) {
//     console.log(err);
//   });

var app = express();
app.set('view engine', 'jade')
  .use(express.static('pub'));

app.get('/', function (req, res) {
  res.render('index.jade')
});

app.listen(8080);
