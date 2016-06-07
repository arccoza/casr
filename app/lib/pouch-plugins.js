var nurl = require('url');
var sift = require('sift');
var randomstring = require('randomstring');
var crypto = require('crypto');
var PouchDB = require('pouchdb');
var utils = require('./pouch-utils');
var CouchDbSecurity = require('./models').CouchDbSecurity;


var plugs = {
  use: function(dbName, options) {
    var isRemote = this._db_name.indexOf('http://') > -1 || this._db_name.indexOf('https://') > -1;
    var opts = options || Object.assign({}, this.__opts);
    opts.skip_setup = !options ? true : opts.skip_setup;

    // dbName = encodeURIComponent(dbName);

    if(isRemote)
      dbName = nurl.resolve(this._db_name, '/' + encodeURIComponent(dbName));

    if(!options && this._db_name == dbName) {
      return this;
    }
    else
      return new PouchDB(dbName, opts);
  },
  findValidate: utils.toPromise(function(query, subject, callback) {
    try {
      var result = sift(query, subject);
      callback(null, result);
    }
    catch(ex) {
      callback(ex)
    }
  }),
  findValidator: function(query, selector) {
    return sift(query, selector);
  },
  sessions() {
    if(this._sessions)
      return this._sessions;

    var ajax = this.constructor.ajax;
    var op = utils.toPromise((op, username, password, callback) => {
      var opts = {
        method: op == 'add' ? 'POST' : op == 'rem' ? 'DELETE' : 'GET',
        url: nurl.resolve(this.getUrl(), '/' + '_session'),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': '*/*' }
      }

      if(op == 'add')
        opts.body = 'name=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password);

      var r = ajax(opts, (err, res) => {
        callback(err, res);
        // console.log(r.response.headers['set-cookie'])
      });
    });

    this.constructor.prototype._sessions = {
      get: op.bind(null, 'get', null, null),
      add: op.bind(null, 'add'),
      rem: op.bind(null, 'rem', null, null),
      remove: op.bind(null, 'rem', null, null)
    }

    return this._sessions;
  },
  permissions() {
    if(this._permissions)
      return this._permissions;

    var op = utils.toPromise((function(op, group, target, value, callback) {
      if(typeof value == 'function') {
        callback = value;
        value = null;
      }
      else if(typeof target == 'function') {
        callback = target;
        target = null;
        value = null;
      }

      this._permissions.get()
        .then(res => {
          return new CouchDbSecurity(res)[op](group, target, value);
        })
        .then(res => {
          this._permissions.put(res, callback);
        })
        .catch(callback);
    }).bind(this));

    this.constructor.prototype._permissions = {
      get: utils.toPromise((callback) => {
        this.request({
          method: 'GET',
          url: '_security'
        }, (err, res) => {
          callback(err, new CouchDbSecurity(res));
        });
      }),
      put: utils.toPromise((obj, callback) => {
        this.request({
          method: 'PUT',
          url: '_security',
          body: obj
        }, callback);
      }),
      add: op.bind(null, 'add'),
      rem: op.bind(null, 'rem'),
      remove: op.bind(null, 'rem'),
      addAdminUser: op.bind(null, 'add', 'admins', 'names'),
      remAdminUser: op.bind(null, 'rem', 'admins', 'names'),
      addAdminRole: op.bind(null, 'add', 'admins', 'roles'),
      remAdminRole: op.bind(null, 'rem', 'admins', 'roles'),
      addMemberUser: op.bind(null, 'add', 'members', 'names'),
      remMemberUser: op.bind(null, 'rem', 'members', 'names'),
      addMemberRole: op.bind(null, 'add', 'members', 'roles'),
      remMemberRole: op.bind(null, 'rem', 'members', 'roles')
    }

    return this._permissions;
  },
  users() {
    if(this._users)
      return this._users;

    var Promise = this.constructor.utils.Promise;
    var db = plugs.use.bind(this)('_users');
    var isRemote = this._db_name.indexOf('http://') > -1 || this._db_name.indexOf('https://') > -1;
    var isCloudant = isRemote && this._db_name.indexOf('cloudant') > -1;

    db.genUid = () => {
      return randomstring.generate({
        length: 12,
        charset: 'hex'
      });
    }
    db.generateUid = this.genUid;

    db.genPasswordHash = (password, scheme) => {
      // TODO: Add support for pbkdf2 scheme.
      scheme = 'simple';
      var salt = crypto.randomBytes(16).toString('hex');
      var hash = crypto.createHash('sha1');

      hash.update(password + salt);
      return [hash.digest('hex'), salt];
    }
    db.generatePasswordHash = this.genPasswordHash;

    var get = db.get.bind(db);
    var put = db.put.bind(db);
    var rem = db.remove.bind(db);

    // TODO: Figure out why the weird func replacement behaviour.
    var op = utils.toPromise((function(op, user, callback) {
      // console.log('op', op, user)
      if(op == 'get' && user && (user._id || typeof user == 'string')) {
        // console.log('get before', user)
        if(typeof user == 'string') {
          user = user.indexOf('org.couchdb.user:') != -1 ? user : 'org.couchdb.user:' + user;
          user = { _id: user }
        }
        // console.log('get before', user)
        // console.log(get == db.get)
        return get(user._id, (err, res) => {
            if(err)
              callback(err, res);
            else {
              user = Object.assign(res, user);
              addUidProp(user);
              callback(err, res);
            }
          });
        // db.request({
        //   method: 'GET',
        //   url: user._id
        // }, callback)
        // console.log('get after')
      }
      else if(op == 'get') {
        return callback(new Error('[users] get() invalid arguments.'));
      }

      if(op == 'put' && user) {
        return put(user, callback);
      }
      else if(op == 'put') {
        return callback(new Error('[users] put() invalid arguments.'));
      }

      if(op == 'add' && user && user.name && user.password) {
        var uid = this.genUid();
        user._id = user._id || 'org.couchdb.user:' + user.name;
        user.type = 'user';

        if(user.roles)
          user.roles.unshift('uid:' + uid);
        else
          user.roles = ['uid:' + uid];

        if(isCloudant) {
          var hashAndSalt = this.genPasswordHash(user.password);

          user.password_sha = hashAndSalt[0];
          user.salt = hashAndSalt[1];
          user.password_scheme = 'simple';
          delete user.password;
        }

        return put(user, (err, res) => {
            if(err)
              callback(err, res);
            else {
              user = Object.assign(res, user);
              addUidProp(user);
              delete user.ok;
              callback(err, res);
            }
          });
      }
      else if(op == 'add') {
        return callback(new Error('[users] add() invalid arguments.'));
      }

      if(op == 'rem' && user) {
        return rem(user, callback);
      }
      else if(op == 'rem') {
        return callback(new Error('[users] rem() or remove() invalid arguments.'));
      }

      // console.log('whoops')

    }).bind(db));

    var addUidProp = obj => {
      if(!obj.hasOwnProperty('uid')) {
        Object.defineProperty(obj, 'uid', {
          get: function() { return obj.roles ? obj.roles.find(el => el.indexOf('uid:') == 0) : null; },
        });
      }
    }


    // this.users.op = op.bind(null);

    db.get = op.bind(null, 'get');
    db.put = op.bind(null, 'put');
    db.add = op.bind(null, 'add');
    db.rem = op.bind(null, 'rem');
    db.remove = op.bind(null, 'rem');

    this.constructor.prototype._users = db;
    return this._users;
  },
  stores() {
    if(this._stores)
      return this._stores;

    var use = plugs.use.bind(this);
    var isRemote = this._db_name.indexOf('http://') > -1 || this._db_name.indexOf('https://') > -1;

    var op = utils.toPromise((op, prefix, store, callback) => {
      var opts = Object.assign({}, this.__opts);

      if(typeof store == 'function') {
        callback = store;
        store = prefix;
      }

      if(typeof store != 'string') {
        try {
          store = store.uid;
        }
        catch(ex) {
          return callback(ex);
        }
      }

      if(prefix)
        store = prefix[prefix.length - 1] == '/' ? prefix + store : prefix + '/' + store;

      // if(isRemote)
      //   store = nurl.resolve(this._db_name, '/' + encodeURIComponent(store));

      if(op == 'add') {
        opts.skip_setup = false;
        opts.skipSetup = false;
      }
      else {
        opts.skip_setup = true;
        opts.skipSetup = true;
      }

      var pdb = use(store, opts);

      // if(op == 'get') {
      //   return pdb.get('', (err, res) => {
      //     if(err)
      //       callback(err, res);
      //     else {
      //       res.db = pdb;
      //       res.store = pdb;
      //       callback(err, res);
      //     }
      //   });
      // }

      if(op == 'get' || op == 'add') {
        return pdb.get('', (err, res) => {
          if(err)
            callback(err, res);
          else {
            res.db = pdb;
            res.store = pdb;
            callback(err, res);
          }
        });
      }

      if(op == 'rem') {
        return pdb.get('', (err, res) => {
          if(err)
            callback(err, res);
          else {
            pdb.destroy(opts, callback);
          }
        });
      }
    });

    this.constructor.prototype._stores = {
      get: op.bind(null, 'get'),
      add: op.bind(null, 'add'),
      rem: op.bind(null, 'rem'),
      remove: op.bind(null, 'rem'),
      toHex(str) {
        var hex = '';

        for(var i = 0; i < str.length; i++) {
          hex += str.codePointAt(i).toString(16);
        }

        return hex;
      }
    }

    return this._stores;
  }
}


module.exports = plugs;
