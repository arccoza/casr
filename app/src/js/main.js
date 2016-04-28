// var Vue = require('vue');
// var PouchDB = require('pouchdb');
import Vue from 'vue';
import PouchDb from 'pouchdb';


// var remote = 'https://arccoza.cloudant.com/test';
// var opts = {
//     auth: {
//       username: 'dautherhybertilsevandeve',
//       password: '2268b00792833903a4e6a76fb567e7fa04cdc683'
//     },
//     continuous: true
//   };
// var db = new PouchDB('test');

// db.replicate.to(remote, opts);
// db.replicate.from(remote, opts);


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

  var glyph = require('./components/glyph.vue');
  var toggle = require('./components/toggle.vue');
  var _switch = require('./components/switch.vue');
  console.log(glyph);

  var app = new Vue({
    el: '#app',
    data: {},
    components: {
      glyph,
      toggle,
      switch: _switch
    },
    methods: {
      logger(ev) {
        console.log(ev);
      }
    }
  });

  // console.log(app);

});
