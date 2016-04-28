var PouchDB = require('pouchdb');
var express = require('express');


var remote = 'https://arccoza.cloudant.com/test';
var opts = {
    auth: {
      username: 'dautherhybertilsevandeve',
      password: '2268b00792833903a4e6a76fb567e7fa04cdc683'
    }
  };
var db = new PouchDB(remote, opts);

// db.allDocs().then(res => {
//   console.log('[response] \n', res);
// }).catch(err => {
//   console.log('[error] \n', err);
// });

db.changes({
    since: 'now',
    live: true,
    include_docs: true
  }).on('change', function(change) {
    console.log(change);
  }).on('complete', function(info) {
    console.log(info);
  }).on('error', function (err) {
    console.log(err);
  });

var app = express();
app.set('view engine', 'jade')
  .use(express.static('pub'));

app.get('/', function (req, res) {
  res.render('index.jade')
});

app.listen(8080);
