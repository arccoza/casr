import Vue from 'vue';
import { StateManager } from 'voie';
import PouchDB from 'pouchdb';
import plugs from '../../lib/pouch-plugins';


PouchDB.plugin(plugs);
var proxyDb = new PouchDB('http://localhost:8080/users', { skip_setup: true });
var users = proxyDb.users('users');
var remoteDb = new PouchDB('https://arccoza.cloudant.com/_users', { skip_setup: true });
var sessions = remoteDb.sessions();
var localDb = new PouchDB('users', { skip_setup: true });
var stores = localDb.stores();


module.exports = function() {
  var app = new StateManager({
    el: '#app',
    base: '/app',
    activeClass: 'here',
    beforeEach(ctx) {
      // if (ctx.state.name === 'private') {
      //   return { redirect: 'not_allowed' };
      // }
      console.log(ctx);
    }
  });

  app.add('root', {
    path: '/',
    component: require('./components/root/root.vue')
  });

  app.add('auth', {
    parent: 'root',
    path: '/auth',
    component: require('./components/auth/login.vue')
  });

  return app;
}
