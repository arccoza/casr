'use strict'
var PouchDB = require('pouchdb');
var PouchAuth = require('pouchdb-auth');
var crypto = require('crypto');
var Ajv = require('ajv');


PouchDB.plugin(PouchAuth);
var ajv = Ajv({ removeAdditional: false, verbose: true, allErrors: true });

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
  // constructor(obj) {
  //   Object.assign(this, obj);

  //   let validate = ajv.compile(User.schema);
  //   priv(this).validate = () => {
  //     let ret = validate(this);
  //     priv(this).errors = validate.errors;
  //     return ret;
  //   }
  // }

  // get isValid() {
  //   return priv(this).validate();
  // }

  // get errors() {
  //   return priv(this).errors;
  // }

  static get schema() {
    return {
      type: 'object',
      "additionalProperties": false,
      properties: {
        name: {
          type: 'string'
        },
        password: {
          type: 'string'
        },
        validate: {}
      },
      required: ['name', 'password']
    }
  }
}

var user = new User({
  name: 'bob',
  password: 'asdfjasld'
});

console.log(user.isValid, user.errors);

class Users {
  constructor(dbUrl, options) {
    options = options || {};
    options.skipSetup = true;
    this._db = new PouchDB(dbUrl, options);
    this._db.useAsAuthenticationDB();

    this._ = {};
    this._.isRemote = dbUrl.indexOf('http://') > -1 || dbUrl.indexOf('https://') > -1;
    this._.isCloudant = this.isRemote && dbUrl.indexOf('cloudant') > -1;
  }

  get isRemote() {
    return this._.isRemote;
  }

  get isCloudant() {
    return this._.isCloudant;
  }

  register(obj) {

  }
}

module.exports = Users;
