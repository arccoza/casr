// var Vue = require('vue');
// var PouchDB = require('pouchdb');
import Vue from 'vue';
// import PouchDB from 'pouchdb';
// import plugs from '../../lib/pouch-plugins';


// PouchDB.plugin(plugs);


// var db = new PouchDB('http://localhost:8080/users', { skip_setup: true });

// db.users('users').add({name: 'jin', password: 'jin'})
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))

// db.users('users').get('jin')
//   .then(rep => db.users().rem(rep))
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))

// var opts = {
//     skipSetup: true,
//     auth: {
//       username: 'arccoza',
//       password: 'carbonscape'
//     }
//   };
// var db = new PouchDB('https://arccoza.cloudant.com/_users', opts);

// db.bulkDocs([
//   {name : 'sam', _id: 'org.couchdb.user:sam'}
// ])
//   .then(console.log.bind(console))
//   .catch(console.log.bind(console))


// db.login('arccoza', 'carbonscape')
//   .then(function(res) {
//     console.log("I'm Batman.", res);

//     return db.signup('deanv', 'team_venture');
//   })
//   .then(res => {
//     console.log(res);

//     return res;
//   })
//   .then(res => {
//     return db.logout();
//   })
//   .catch(err => {
//     console.log(err);
//   });
// var ajaxOpts = {
//   ajax: {
//     headers: {
//       Authorization: 'Basic ' + window.btoa('deanv' + ':' + 'think_tank')
//     }
//   }
// };
// db.login('deanv', 'think_tank', ajaxOpts)
//   .then(function(res) {
//     console.log("I'm Batman.", res);

//     return res;
//   })
//   .then(res => {
//     return db.logout();
//   })
//   .catch(err => {
//     console.log(err);
//   });


document.addEventListener('DOMContentLoaded', function() {

  var app = require('./app')();
  app.start();


  // var glyphs = require('./components/glyphs.vue');
  // var glyph = require('./components/glyph.vue');
  // var toggle = require('./components/toggle.vue');
  // var _switch = require('./components/switch.vue');
  // var button = require('./components/button.vue');
  // var field = require('./components/field.vue');
  // console.log(glyph);

  // var app = new Vue({
  //   el: '#app',
  //   data: {},
  //   components: {
  //     glyphs,
  //     glyph,
  //     'ui-tgl': toggle,
  //     'ui-swt': _switch,
  //     'ui-btn': button,
  //     'ui-fld': field
  //   },
  //   methods: {
  //     logger(ev) {
  //       console.log(ev);
  //     }
  //   }
  // });

  // console.log(app);

});
