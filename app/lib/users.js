'use strict'
var nurl = require('url');
var PouchDB = require('pouchdb');
var pouchAuth = require('pouchdb-authentication-cloudant');
var pouchFind = require('pouchdb-find');
var pouchPlugs = require('./pouch-plugins');
var crypto = require('crypto');
var randomstring = require('randomstring');
var User = require('./models').User;
var Promise = PouchDB.utils.Promise;
var ajax = PouchDB.ajax;


// PouchDB.plugin(pouchAuth);
PouchDB.plugin(pouchFind);
PouchDB.plugin(pouchPlugs);

class Users {
  constructor(dbUrl, options) {
    options = options || {};
    options.skip_setup = true;

    if(dbUrl instanceof PouchDB) {
      this._db = dbUrl;
      dbUrl = this._db.getUrl();
    }
    else
      this._db = new PouchDB(dbUrl, options);

    this._isRemote = dbUrl.indexOf('http://') > -1 || dbUrl.indexOf('https://') > -1;
    this._isCloudant = this.isRemote && dbUrl.indexOf('cloudant') > -1;

    if(this.isRemote)
      this._db = this._db.use('_users');
  }

  get db() {
    return this._db;
  }

  get isRemote() {
    return this._isRemote;
  }

  get isCloudant() {
    return this._isCloudant;
  }

  get _securityObjTmpl() {
    return {
      admins: {
        names: [],
        roles: []
      },
      members: {
        names: [],
        roles: []
      }
    }
  }

  get(user) {
    var db = this.db;
    var username = typeof user == 'string' ? user : user.name;

    return db.get('org.couchdb.user:' + username)
      .then(res => {
        return new User(res);
      });
  }

  put(user) {
    var db = this.db;

    return db.put(user);
  }

  login(username, password) {
    var db = this.db;

    if (!username) {
      return Promise.resolve()
        .then(() => {
          throw new Error('[Users.login] you must provide a username.');
        });
    } else if (!password) {
      return Promise.resolve()
        .then(() => {
          throw new Error('[Users.login] you must provide a password.');
        });
    }

    return db.enableSessions().add(username, password);
  }

  logout() {
    var db = this.db;
    return db.enableSessions().rem();
  }

  session() {
    var db = this.db;
    return db.enableSessions().get();
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

    // Add a unique id to the roles array for each user.
    // In case you want to change username.
    var roleId = 'uid:' + randomstring.generate({
      length: 12,
      charset: 'hex'
    });

    if(user.roles)
      user.roles.unshift(roleId);
    else
      user.roles = [roleId];

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

  _addRemUser(user, options) {
    user._id = user._id || 'org.couchdb.user:' + user.name;
    options = Object.assign({ isRemove: false }, options);

    // Generate the password hash for Cloudant, because it won't do it automatically.
    if(!options.isRemove && this.isCloudant) {
      let hashAndSalt = this.generatePasswordHash(user.password);

      user.password_sha = hashAndSalt[0];
      user.salt = hashAndSalt[1];
      user.password_scheme = 'simple';
      delete user.password;
    }

    var db = this._db.use('_users');
    var promise;

    if(options.isRemove)
      promise = db.remove(user)
    else
      promise = db.put(user);

    return promise;
  }

  /**
   * Method to add a user DB.
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

    var userDbName = 'userdb/' + this.toHex(user.name);
    var promise = this._addRemDb(userDbName, { isRemove: false })
      .then(res => {
        var db = this.db.use(userDbName);
        return db.enablePermissions().add('admins', {names: [user.name], roles: ['admins']});
      });

    return promise;
  }

  putUserDbSecurity(user, securityObj) {
    var userDbName = 'userdb/' + this.toHex(user.name);
    var db = this.db.use('userDbName');
    var sec = securityObj || this._securityObjTmpl;

    sec.admins.names.push(user.name);
    sec.admins.roles.push('admins');

    return db.request({
      method: 'PUT',
      url: '_security',
      // headers : headers,
      body: JSON.stringify(sec)
    });
  }

  /**
   * Method to remove a user DB.
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

  /**
   * Private method to add or remove DBs.
   *
   * @param      {String}   dbName   - Name of the DB to add or remove.
   * @param      {Object}   [options]  - Options for DB add / remove.
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
    headers['Content-Type'] = 'application/json';

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
   * Generate a SHA1 hashed password, to support Cloudant user creation.
   *
   * @param      {String}  password  - The password
   * @return     {Array}   - SHA1 hashed password and its salt.
   */
  generatePasswordHash(password) {
    var salt = crypto.randomBytes(16).toString('hex');
    var hash = crypto.createHash('sha1');

    hash.update(password + salt);
    return [hash.digest('hex'), salt];
  }
}

module.exports = {
  User,
  Users
}
