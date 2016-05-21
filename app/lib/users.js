'use strict'
var PouchDB = require('pouchdb');
var PouchAuth = require('pouchdb-authentication-cloudant');
var PouchFind = require('pouchdb-find');
var crypto = require('crypto');
var Ajv = require('ajv');
var Promise = PouchDB.utils.Promise;


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
      console.log(dbUrl);
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

  register(user) {
    if(!(user instanceof User && user.isValid && user.name && user.password)) {
      return Promise.resolve()
        .then(() => {
          throw new Error('[Users.register] Invalid user.');
        });
    }

    var db = this._db;

    if(this.isCloudant) {
      let hashAndSalt = this.generatePasswordHash(user.password);

      user._id = 'org.couchdb.user:' + user.name;
      user.password_sha = hashAndSalt[0];
      user.salt = hashAndSalt[1];
      user.password_scheme = 'simple';
      delete user.password;
      // return db.put(user);
    }
    // else {
    //   return db.signUp(user.name, user.password, { metadata: { roles: user.roles || [] } });
    // }
    // console.log(db)

    console.log(db.getUrl());

    let opts = {
      method: 'PUT',
      url: 'https://arccoza.cloudant.com/_users/' + user._id,
      headers : {'Content-Type': 'application/json',
        Authorization: 'Basic ' + new Buffer('arccoza' + ':' + 'carbonscape').toString('base64')},
      body: user
    }

    PouchDB.ajax(opts, (err, res) => {console.log(err, res)});

    // return db.request(opts, () => {console.log(opts)});
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
