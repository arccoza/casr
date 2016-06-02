var nurl = require('url');
var sift = require('sift');
var randomstring = require('randomstring');
var crypto = require('crypto');
var PouchDB = require('pouchdb');
var wrappers = require('pouchdb-wrappers');
var utils = require('./pouch-utils');
var CouchDbSecurity = require('./models').CouchDbSecurity;


var plugs = {
  use: function(dbName) {
    var isRemote = this._db_name.indexOf('http://') > -1 || this._db_name.indexOf('https://') > -1;
    var opts = Object.assign({}, this.__opts);
    opts.skip_setup = true;

    // dbName = encodeURIComponent(dbName);

    if(isRemote)
      dbName = nurl.resolve(this._db_name, '/' + encodeURIComponent(dbName));

    if(this._db_name == dbName)
      return this;
    else
      return new PouchDB(dbName, this.__opts);
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
  enableSessions() {
    if(this.sessions)
      return this.sessions;

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

    this.sessions = {
      get: op.bind(null, 'get', null, null),
      add: op.bind(null, 'add'),
      rem: op.bind(null, 'rem', null, null),
      remove: op.bind(null, 'rem', null, null)
    }

    return this.sessions;
  },
  enablePermissions() {
    if(this.permissions)
      return this.permissions;

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

      this.permissions.get()
        .then(res => {
          return new CouchDbSecurity(res)[op](group, target, value);
        })
        .then(res => {
          this.permissions.put(res, callback);
        })
        .catch(callback);
    }).bind(this));

    this.permissions = {
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

    return this.permissions;
  },
  enableUsers() {
    if(this.users)
      return this.users;

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

    var get = null;
    var put = db.put.bind(db);
    var rem = db.remove.bind(db);

    var op = utils.toPromise((function(op, user, callback) {
      console.log('op', op, user)
      if(op == 'get' && user && (user._id || typeof user == 'string')) {
        if(typeof user == 'string') {
          user = user.indexOf('org.couchdb.user:') != -1 ? user : 'org.couchdb.user:' + user;
          user = { _id: user }
        }
        console.log('get before')
        console.log(get)
        get(user._id, callback);
        console.log('get after')
      }
      else if(op == 'get') {
        return callback(new Error('[users] get() invalid arguments.'));
      }

      if(op == 'put' && user && user._id && user._rev) {
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

        return put(user, callback);
      }
      else if(op == 'add') {
        return callback(new Error('[users] add() invalid arguments.'));
      }

      if(op == 'rem' && user && user._id && user._rev) {
        console.log('rem')
        return rem(user, callback);
      }
      else if(op == 'rem') {
        return callback(new Error('[users] rem() or remove() invalid arguments.'));
      }

      console.log('whoops')

    }).bind(db));

    this.users = db;
    // this.users.op = op.bind(null);

    var count = 0;
    wrappers.installWrapperMethods(db, {
      get(orig, args) {
        count++;
        console.log(count);
        if(args.docId.indexOf('org.couchdb.user:') == -1)
          args.docId = 'org.couchdb.user:' + args.docId;
        return orig();

      }
    })
    // this.users.get = op.bind(null, 'get');
    // this.users.put = op.bind(null, 'put');
    // this.users.add = op.bind(null, 'add');
    // this.users.rem = op.bind(null, 'rem');
    // this.users.remove = op.bind(null, 'rem');

    return this.users;
  }
}


module.exports = plugs;
