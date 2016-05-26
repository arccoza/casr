'use strict'
var nurl = require('url');
var PouchDB = require('pouchdb');
var PouchAuth = require('pouchdb-authentication-cloudant');
var PouchFind = require('pouchdb-find');
var crypto = require('crypto');
var User = require('./models').User;
var Promise = PouchDB.utils.Promise;
var ajax = PouchDB.ajax;


PouchDB.plugin(PouchAuth);
PouchDB.plugin(PouchFind);
PouchDB.plugin({
  use: function(dbName) {
    var isRemote = this._db_name.indexOf('http://') > -1 || this._db_name.indexOf('https://') > -1;
    var dbName = nurl.resolve(this._db_name, '/' + dbName);

    return new PouchDB(dbName, this.__opts);
  }
})

class Users {
  constructor(dbUrl, options) {
    options = options || {};
    options.skipSetup = true;

    if(dbUrl instanceof PouchDB) {
      this._db = dbUrl;
      dbUrl = this._db.getUrl();
    }
    else
      this._db = new PouchDB(dbUrl, options);

    this._ = {};
    this._.isRemote = dbUrl.indexOf('http://') > -1 || dbUrl.indexOf('https://') > -1;
    this._.isCloudant = this.isRemote && dbUrl.indexOf('cloudant') > -1;
  }

  get db() {
    return this._db;
  }

  get isRemote() {
    return this._.isRemote;
  }

  get isCloudant() {
    return this._.isCloudant;
  }

  get(username) {
    var db = this._db;

    return db.get('org.couchdb.user:' + username);
  }

  generatePasswordHash(password) {
    var salt = crypto.randomBytes(16).toString('hex');
    var hash = crypto.createHash('sha1');

    hash.update(password + salt);
    return [hash.digest('hex'), salt];
  }

  _addRemUser(user, options) {
    user._id = user._id || 'org.couchdb.user:' + user.name;
    options = Object.assign({ isRemove: false }, options);

    // var db = this._db;
    // var method = options.isRemove ? 'DELETE' : 'PUT';
    // var query = options.isRemove ? '?rev=' + user._rev : '';
    // var usersDb = options.isServerAdmin ? '/_config/admins/' + encodeURIComponent(user.name) : '/_users/' + encodeURIComponent(user._id);
    // var url = nurl.resolve(db.getUrl(), usersDb) + query;
    // var headers = db.getHeaders();
    // headers['Content-Type'] = options.isServerAdmin ? 'application/x-www-form-urlencoded' : 'application/json';
    // var body = options.isServerAdmin ? user.password : user;

    // Generate the password hash for Cloudant, because it won't do it automatically.
    if(!options.isRemove && this.isCloudant) {
      let hashAndSalt = this.generatePasswordHash(user.password);

      user.password_sha = hashAndSalt[0];
      user.salt = hashAndSalt[1];
      user.password_scheme = 'simple';
      delete user.password;
    }

    // let opts = {
    //   method: method,
    //   url: url,
    //   headers: headers,
    //   body: body
    // }

    // let promise = new Promise((resolve, reject) => {
    //   ajax(opts, (err, res) => {
    //     if(err)
    //       reject(err);
    //     else
    //       resolve(res);
    //   });
    // });
    var db = this._db.use('_users');
    var promise;
    console.log(db.getUrl())
    if(options.isRemove)
      promise = db.remove(user)
    else
      promise = db.put(user);

    return promise;
  }

  /**
   * Add a new user.
   *
   * @param      {User}     user                           - The user model.
   * @param      {Object}   [options]                      - The options.
   * @param      {Boolean}  [options.isServerAdmin=false]  - If true then the user
   *                                                       will be created as a
   *                                                       server admin.
   * @param      {Boolean}  [options.dbPerUser=true]       - Create a DB for the new
   *                                                       user.
   * @return     {Promise}                                 - A Promise.
   */
  add(user, options) {
    // Can only create users on a proper CouchDB server, not PouchDB.
    if(!this.isRemote) {
      return Promise.resolve()
        .then(() => {
          throw new Error('[Users.add] You can only add users on a CouchDB.');
        });
    }

    // Make sure the new user is valid.
    if(!(user instanceof User && user.isValid && user.name && user.password)) {
      return Promise.resolve()
        .then(() => {
          throw new Error('[Users.add] Invalid user.');
        });
    }

    options = Object.assign({ dbPerUser: true }, options);

    let promise = this._addRemUser(user, options);

    if(options.dbPerUser) {
      promise = promise
        .then(res => {
          return this.addUserDb(user);
        })
        .catch(err => {
          if(err.status == 412 && err.name == 'file_exists') {
            return this.remUserDb(user)
              .then(res => {
                return this.addUserDb(user);
              })
              .catch(err => {
                return err;
              })
          }
          else
            return err;
        });
    }

    return promise;
  }

  rem(user, options) {
    // Can only create users on a proper CouchDB server, not PouchDB.
    if(!this.isRemote) {
      return Promise.resolve()
        .then(() => {
          throw new Error('[Users.rem] You can only remove users on a CouchDB.');
        });
    }

    // Make sure the new user is valid.
    if(!(user instanceof User && user.isValid && user._id && user._rev)) {
      return Promise.resolve()
        .then(() => {
          throw new Error('[Users.rem] Invalid user.');
        });
    }

    options = Object.assign({ dbPerUser: true }, options);

    let promise = this._addRemUser(user, { isRemove: true });

    if(options.dbPerUser) {
      promise = promise
        .then(res => {
          return this.remUserDb(user);
        })
        .catch(err => {
          return err;
        })
    }

    return promise;
  }

  /**
   * Convert a String to it's hex representation.
   *
   * @param      {String}  str     - The string.
   * @return     {String}  - The hex string.
   */
  toHex(str) {
    var hex = '';

    for(let i = 0; i < str.length; i++) {
      hex += str.codePointAt(i).toString(16);
    }

    return hex;
  }

  /**
   * Private method to add or remove DBs.
   *
   * @param      {String}   dbName   - Name of the DB to add or remove.
   * @param      {Object}   options  - Options for DB add / remove.
   * @param      {Boolean}   [options.isRemove=false]        - Set to `true` to
   *                                                         remove the DB.
   * @param      {Object}    options.security                - The security
   *                                                         properties for the new
   *                                                         DB.
   * @param      {Object}    options.security.admins         - The DB admins.
   * @param      {String[]}  options.security.admins.names   - List of users who will
   *                                                         be admins on this DB.
   * @param      {String[]}  options.security.admins.roles   - List of roles who will
   *                                                         be admins on this DB.
   * @param      {Object}    options.security.members        - The DB members.
   * @param      {String[]}  options.security.members.names  - List of users who will
   *                                                         be members on this DB.
   * @param      {String[]}  options.security.members.roles  - List of roles who will
   *                                                         be members on this DB.
   * @return     {Promise}  - A Promise.
   */
  _addRemDb(dbName, options) {
    options = Object.assign({ isRemove: false }, options);
    var db = this._db;
    var method = options.isRemove ? 'DELETE' : 'PUT';
    var url = nurl.resolve(db.getUrl(), '/' + encodeURIComponent(dbName));
    var headers = db.getHeaders();
    headers['Content-Type'] = 'application/x-www-form-urlencoded';

    let opts = {
      method: method,
      url: url,
      headers: headers
    }

    let promise = new Promise((resolve, reject) => {
      ajax(opts, (err, res) => {
        if(err)
          reject(err);
        else
          resolve(res);
      });
    });

    return promise;
  }

  /**
   * Private method to add a user DB.
   *
   * @param      {User}     user    - The User object.
   * @return     {Promise}  - A Promise.
   */
  addUserDb(user) {
    // Can only create userDb on a proper CouchDB server, not PouchDB.
    if(!this.isRemote) {
      return Promise.resolve()
        .then(() => {
          throw new Error('[Users.addUserDb] You can only create a users DB on a CouchDB.');
        });
    }

    var userDb = 'userdb/' + this.toHex(user.name);

    return this._addRemDb(userDb, { isRemove: false });
  }

  /**
   * Private method to remove a user DB.
   * @param      {User}     user    - The User object.
   * @return     {Promise}  - A Promise.
   */
  remUserDb(user) {
    // Can only delete userDb on a proper CouchDB server, not PouchDB.
    if(!this.isRemote) {
      return Promise.resolve()
        .then(() => {
          throw new Error('[Users.remUserDb] You can only delete a users DB on a CouchDB.');
        });
    }

    var userDb = 'userdb/' + this.toHex(user.name);

    return this._addRemDb(userDb, { isRemove: true });
  }

  login(username, password) {
    var db = this._db;

    // if (!username) {
    //   return callback(new AuthError('you must provide a username'));
    // } else if (!password) {
    //   return callback(new AuthError('you must provide a password'));
    // }

    // return db.logIn(username, password);
    // var ajaxOpts = utils.extend(true, {
    //   method : 'POST',
    //   url : utils.getSessionUrl(db),
    //   headers : {'Content-Type': 'application/x-www-form-urlencoded'},
    //   body : 'name=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password)
    // }, opts.ajax || {});
    // utils.ajax(ajaxOpts, wrapError(callback));

    return db.request({
      method: 'POST',
      url: '_session',
      headers : {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': '*/*'},
      body: 'name=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password)
    });
  }

  logout() {
    var db = this._db;

    return db.logOut();
  }

  session() {
    var db = this._db;

    // return db.session();
    return db.request({
      method: 'GET',
      url: '_session',
      headers : {'Content-Type': 'application/x-www-form-urlencoded'}
    });
  }
}

module.exports = {
  User,
  Users
}
