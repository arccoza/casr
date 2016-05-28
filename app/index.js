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

// users.addUserDb({name: 'bob'})
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))

// users.get('bob')
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))

// users.add(new User({
//   name: 'bob',
//   password: 'bob'
// }))
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))

// db.enablePermissions().permissions.get()
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))


var a = {
  admins: {
    names: ['sam', 'jim'],
    roles: ['users', 'friends']
  }
}

var b = {
  admins: {
    names: ['bob'],
    roles: ['clients']
  },
  members: {
    names: [],
    roles: []
  }
}

console.log(db.constructor.utils.extend(a,b))

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
