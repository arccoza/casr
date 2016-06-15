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
  var user = null;
  var app = new StateManager({
    el: '#app',
    base: '/app',
    activeClass: 'here',
    beforeEach(ctx) {
      // if (ctx.state.name === 'private') {
      //   return { redirect: 'not_allowed' };
      // }
      console.log(ctx);
      if(ctx.state.parentState &&
        ctx.state.parentState.name == 'auth' &&
        ctx.state.name != 'auth.login' &&
        ctx.state.name != 'auth.register' ) {
        return { redirect: 'auth.login' }
      }

      // sessions.get()
      //     .then(rep => {
      //       if(rep.userCtx.name)
      //         return rep.userCtx;
      //       else
      //         throw rep.userCtx;
      //     })
      //     .then(rep => user = rep)
      //     .catch(err => { redirect: 'auth.login' })
    }
  });

  app.add('root', {
    path: '/',
    component: require('./components/root/root.vue')
  });

  // app.add('busy', {
  //   parent: 'root',
  //   component: require('./components/root/busy.vue')
  // });

  app.add('auth', {
    parent: 'root',
    path: '/auth',
    // redirect: 'auth.login'
    // component: require('./components/auth/login.vue')
  });

  app.add('auth.login', {
    // parent: 'auth',
    path: '/auth/login',
    component: require('./components/auth/login.vue')
  });

  app.add('auth.register', {
    // parent: 'auth',
    path: '/auth/register',
    component: require('./components/auth/register.vue')
  });

  return app;
}
