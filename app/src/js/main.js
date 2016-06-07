// var Vue = require('vue');
// var PouchDB = require('pouchdb');
import Vue from 'vue';
import PouchDB from 'pouchdb';
import plugs from '../../lib/pouch-plugins';


PouchDB.plugin(plugs);


var db = new PouchDB('http://localhost:8080/users', { skip_setup: true });

db.users('users').add({name: 'sam', password: 'sam'})
    .then(console.log.bind(console))
    .catch(console.log.bind(console))


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
  // var login = new Vue({
  //   el: '.login',
  //   data: {
  //     username: null,
  //     usernamePlaceholder: 'username pls.',
  //     password: null,
  //     passwordPlaceholder: 'password pls.',
  //   },
  //   methods: {
  //     change: function() {
  //       console.log(this.username, this.password);
  //       db.get('d647546531f85a7d57ba714c033c122e').then(res => {
  //         if(this.password)
  //           res.password = this.password;

  //         if(this.username)
  //           res.username = this.username;

  //         console.log(res);
  //         return db.put(res);
  //       }).catch(err => {
  //         console.log(err);
  //       });
  //     }
  //   }
  // });


  // db.get('d647546531f85a7d57ba714c033c122e').then(function(res) {
  //   // console.log(login);
  //   login.username = res.username;
  // });

  var glyphs = require('./components/glyphs.vue');
  var glyph = require('./components/glyph.vue');
  var toggle = require('./components/toggle.vue');
  var _switch = require('./components/switch.vue');
  var button = require('./components/button.vue');
  var field = require('./components/field.vue');
  console.log(glyph);

  var app = new Vue({
    el: '#app',
    data: {},
    components: {
      glyphs,
      glyph,
      tgl: toggle,
      swt: _switch,
      btn: button,
      fld: field
    },
    methods: {
      logger(ev) {
        console.log(ev);
      }
    }
  });

  // console.log(app);

});
