'use strict'
var nurl = require('url');
var PouchDB = require('pouchdb');
var PouchAuth = require('pouchdb-authentication-cloudant');
var PouchFind = require('pouchdb-find');
var crypto = require('crypto');
var Ajv = require('ajv');
var Promise = PouchDB.utils.Promise;
var ajax = PouchDB.ajax;


PouchDB.plugin(PouchAuth);
PouchDB.plugin(PouchFind);
var ajv = Ajv({ useDefaults: true, removeAdditional: false, verbose: true, allErrors: true });

let privMap = new WeakMap();

let priv = function (object) {
    if (!privMap.has(object))
        privMap.set(object, {});
    return privMap.get(object);
}

class Base {
  constructor(obj, schema) {
    Object.assign(this, obj);

    let validate = ajv.compile(schema);
    priv(this).validate = () => {
      let ret = validate(this);
      priv(this).errors = validate.errors;
      return ret;
    }
  }

  get isValid() {
    return priv(this).validate();
  }

  get errors() {
    return priv(this).errors;
  }
}

class User extends Base {
  constructor(obj) {
    super(obj, User.schema);
  }

  static get schema() {
    return {
      type: 'object',
      additionalProperties: true,
      properties: {
        _id: {
          type: "string"
        },
        _rev: {
          type: "string"
        },
        type: {
          type: "string",
          default: "user"
        },
        name: {
          type: "string"
        },
        password_sha: {
          type: "string"
        },
        salt: {
          type: "string"
        },
        password_scheme: {
          type: "string"
        },
        roles: {
          type: "array",
          items: {
            "type": "string"
          },
          default: []
        }
      }
      // required: ['name', 'password']
    }
  }
}

var user = new User({
  name: 'bob',
  password: 'bob'
});

// console.log(user.isValid, user.errors);

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

  register(user, options) {
    // options can be:
    // {
    //   isServerAdmin: true / false,
    //   dbPerUser: true / false
    // }

    // Can only create users on a proper CouchDB server, not PouchDB.
    if(!this.isRemote) {
      return Promise.resolve()
        .then(() => {
          throw new Error('[Users.register] You can only register users on a CouchDB.');
        });
    }

    // Make sure the new user is valid.
    if(!(user instanceof User && user.isValid && user.name && user.password)) {
      return Promise.resolve()
        .then(() => {
          throw new Error('[Users.register] Invalid user.');
        });
    }

    options = options || {};
    user._id = 'org.couchdb.user:' + user.name;
    var db = this._db;
    var usersDb = options.isServerAdmin ? '/_config/admins/' + encodeURIComponent(user.name) : '/_users/' + encodeURIComponent(user._id);
    var url = nurl.resolve(db.getUrl(), usersDb);
    var headers = db.getHeaders();
    headers['Content-Type'] = options.isServerAdmin ? 'application/x-www-form-urlencoded' : 'application/json';
    var body = options.isServerAdmin ? user.password : user;

    // Generate the password hash for Cloudant, because it won't do it automatically.
    if(this.isCloudant) {
      let hashAndSalt = this.generatePasswordHash(user.password);

      user.password_sha = hashAndSalt[0];
      user.salt = hashAndSalt[1];
      user.password_scheme = 'simple';
      delete user.password;
    }

    // headers['Content-Type'] = 'application/json';
    // Authorization: 'Basic ' + new Buffer('bob' + ':' + 'bob').toString('base64')},

    let opts = {
      method: 'PUT',
      url: url,
      headers: headers,
      body: body
    }

    let promise = new Promise((resolve, reject) => {
      ajax(opts, (err, res) => {
        if(err)
          reject(err);
        else
          resolve(res);
      });
    });

    if(options.dbPerUser) {
      promise = promise
        .then(res => {
          return this.createUserDb(user);
        })
        .catch(err => {
          if(err.status == 412 && err.name == 'file_exists') {
            return this.deleteUserDb(user)
              .then(res => {
                return this.createUserDb(user);
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
    // console.log(ajax(opts, (err, res) => {console.log(err, res)}));

    // return db.request(opts, (err, res) => {console.log(err, res, opts)});
  }

  toHex(str) {
    var hex = '';

    for(let i = 0; i < str.length; i++) {
      hex += str.codePointAt(i).toString(16);
    }

    return hex;
  }

  _createDeleteDb(dbName, isDelete) {
    var db = this._db;
    var method = isDelete ? 'DELETE' : 'PUT';
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

  createUserDb(user) {
    // Can only create userDb on a proper CouchDB server, not PouchDB.
    if(!this.isRemote) {
      return Promise.resolve()
        .then(() => {
          throw new Error('[Users.createUserDb] You can only create a users DB on a CouchDB.');
        });
    }

    var userDb = 'userdb/' + this.toHex(user.name);

    return this._createDeleteDb(userDb, false);
  }

  deleteUserDb(user) {
    // Can only delete userDb on a proper CouchDB server, not PouchDB.
    if(!this.isRemote) {
      return Promise.resolve()
        .then(() => {
          throw new Error('[Users.createUserDb] You can only delete a users DB on a CouchDB.');
        });
    }

    var userDb = 'userdb/' + this.toHex(user.name);

    return this._createDeleteDb(userDb, true);
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
