import Vue from 'vue';
import comps from './components/comps';
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
var Promise = PouchDB.utils.Promise;
comps(Vue);


module.exports = function() {
  // var user = null;
  var app = new StateManager({
    el: '#app',
    base: '/app',
    activeClass: 'here',
    beforeEach(ctx) {
      // if (ctx.state.name === 'private') {
      //   return { redirect: 'not_allowed' };
      // }
      // console.log(ctx);
      // if(ctx.state.parentState &&
      //   ctx.state.parentState.name == 'auth' &&
      //   ctx.state.name != 'auth.login' &&
      //   ctx.state.name != 'auth.register' ) {
      //   return { redirect: 'auth.login' }
      // }

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
  var goto = app.go.bind(app);
  var root = null;
  var ds = { // DataStore
    data: {
      auth: {},
      user: null,
      pageTitle: '...',
      menuItems: { register: true, login: true },
      isBusy: false,
      busyMsg: 'Working...'
    },
    user: {

    }
  };

  ds.user.check = userCheck;
  ds.user.login = userLogin;

  function userCheck(ctx) {
    if(!ds.data.user) {
      return sessions.get()
        .then(rep => {
          if(rep.userCtx.name)
            return rep.userCtx;
          else
            throw rep.userCtx;
        })
        .then(rep => {
          ds.data.user = rep;
          ctx.data.user = ds.data.user;
          return ds.data.user;
        })
        .catch(err => {
          return { redirect: 'auth.login' }
        })
    }
  }

  function userLogin(ctx, username, password) {
    if(!ds.data.user) {
      return sessions.add(username, password)
        .then(rep => {
          ds.data.user = rep.userCtx;
          ctx.data.user = ds.data.user;
          return ds.data.user;
        })
        .catch(err => {
          return { redirect: 'auth.login' }
        })
    }
  }

  app.add('root', {
    path: '/',
    redirect: 'do.auth',
    enter(ctx) {
      root = ctx;
      ctx.data = {
        data: ds.data,
        goto: goto
      }
    },
    component: require('./components/root/root.vue')
  });

  app.add('do', {
    parent: 'root',
    enter(ctx) {
      ds.data.isBusy = true;
      ds.data.busyMsg = 'Working...';
    }
  });

  app.add('auth', {
    parent: 'root',
    path: '/auth',
    redirect: 'auth.login',
    enter(ctx) {
      ds.data.isBusy = false;
      ds.data.busyMsg = 'Working...';
      console.log('--auth--');
    }
  });

  app.add('auth.login', {
    parent: 'auth',
    path: '/auth/login',
    enter(ctx) {
      ds.data.pageTitle = 'Authenticate';
    },
    component: require('./components/auth/login.vue')
  });

  app.add('auth.register', {
    parent: 'auth',
    path: '/auth/register',
    enter(ctx) {
      ds.data.pageTitle = 'Authenticate';
      ctx.data.isRegister = true;
    },
    component: require('./components/auth/login.vue')
  });

  app.add('do.auth', {
    parent: 'do',
    enter(ctx) {
      var userPrm = userCheck(ctx);
      // userPrm.catch(rep => ctx.data.menuItems = { register: true, login: true })

      return userPrm;
    }
  });

  app.add('do.auth.register', {
    parent: 'do',
    enter(ctx) {
      ds.data.busyMsg = 'Registering...';
    }
  });

  app.add('do.auth.login', {
    parent: 'do',
    params: {
      username: null,
      password: null
    },
    enter(ctx) {
      ds.data.busyMsg = 'Logging in...';
      console.log(ctx)
    }
  });

  return app;
}
