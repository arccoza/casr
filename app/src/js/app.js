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
    else
      return ds.data.user;
  }

  function userLogin(ctx, username, password) {
    if(!ds.data.user) {
      return sessions.add(username, password)
        .then(rep => {
          ds.data.user = rep.userCtx;
          ctx.data.user = ds.data.user;
          // ds.data.menuItems = { logout: true };
          return { redirect: 'root' };
        })
        .catch(err => {
          ds.data.auth.error = err.reason;
          return { redirect: 'auth.login' }
        })
    }
  }

  function userLogout(ctx) {
    if(!ds.data.user) {
      return sessions.rem()
        .then(rep => {
          ds.data.user = null;
          ctx.data.user = ds.data.user;
          // ds.data.menuItems = { register: true, login: true };
          return { redirect: 'auth.login' };
        })
        .catch(err => {
          ds.data.auth.error = err.reason;
          return { redirect: 'auth.logout' }
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
      console.log('--root--')
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

  app.add('authenticated', {
    parent: 'root',
    path: '/auth',
    redirect: 'do.auth',
    enter(ctx) {
      ds.data.isBusy = false;
      ds.data.busyMsg = 'Working...';
      ds.data.menuItems = { accommodation: true, reservations: true, users: true, logout: true };
      console.log('--authenticated--');

      if(!ds.data.user)
        return { redirect: 'do.auth' }
    }
  });

  app.add('accommodation', {
    parent: 'authenticated',
    path: '/accommodation',
    enter(ctx) {
      ds.data.pageTitle = 'Accommodation';
    }
  });

  app.add('reservations', {
    parent: 'authenticated',
    path: '/reservations',
    enter(ctx) {
      ds.data.pageTitle = 'Reservations';
    }
  });

  app.add('users', {
    parent: 'authenticated',
    path: '/users',
    enter(ctx) {
      ds.data.pageTitle = 'Users';
    }
  });


  app.add('authenticate', {
    parent: 'root',
    enter(ctx) {
      ds.data.pageTitle = 'Authenticate';
      ds.data.isBusy = false;
      ds.data.busyMsg = 'Working...';
      ds.data.menuItems = { register: true, login: true };
      console.log('--authenticate--');
    }
  });

  app.add('auth.register', {
    parent: 'authenticate',
    path: '/auth/register',
    enter(ctx) {
      ctx.data.isRegister = true;
    },
    component: require('./components/auth/login.vue')
  });

  app.add('auth.login', {
    parent: 'authenticate',
    path: '/auth/login',
    enter(ctx) {
    },
    component: require('./components/auth/login.vue')
  });

  app.add('auth.logout', {
    parent: 'authenticated',
    path: '/auth/logout',
    enter(ctx) {
      // if(!ds.data.user)
      //   return { redirect: 'do.auth' }
    },
    component: require('./components/auth/logout.vue')
  });



  app.add('do.auth', {
    parent: 'do',
    enter(ctx) {
      var userPrm = userCheck(ctx);
      userPrm.catch(rep => ds.data.menuItems = { register: true, login: true })

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
      return userLogin(ctx, ds.data.username, ds.data.password);
    }
  });

  app.add('do.auth.logout', {
    parent: 'do',
    params: {
      username: null,
      password: null
    },
    enter(ctx) {
      ds.data.busyMsg = 'Logging out...';
      return userLogout(ctx);
    }
  });

  return app;
}
