'use strict'
var Ajv = require('ajv');
var _debug = require('debug');


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

// var user = new User({
//   name: 'bob',
//   password: 'bob'
// });

// console.log(user.isValid, user.errors);

class CouchDbSecurity {
  constructor(obj) {
    _debug('casr:CouchDbSecurity')('ctor()');
    this.admins = {
      names: [],
      roles: []
    };
    this.members = {
      names: [],
      roles: []
    };

    if(obj)
      this.merge(obj);
  }

  static uniConcat(a, b) {
    var tmp = a.concat();

      for (var i = 0, elm; elm = b[i++];) {
        if(tmp.indexOf(elm) == -1)
          tmp.push(elm);
      }

    return tmp;
  }

  merge(b) {
    _debug('casr:CouchDbSecurity')('merge()');

    var a = this;
    var uniConcat = CouchDbSecurity.uniConcat;

    if(b.admins) {
      a.admins.names = b.admins.names ? uniConcat(a.admins.names, b.admins.names) : a.admins.names;
      a.admins.roles = b.admins.roles ? uniConcat(a.admins.roles, b.admins.roles) : a.admins.roles;
    }
    if(b.members) {
      a.members.names = b.members.names ? uniConcat(a.members.names, b.members.names) : a.members.names;
      a.members.roles = b.members.roles ? uniConcat(a.members.roles, b.members.roles) : a.members.roles;
    }

    return this;
  }

  separate(b) {
    _debug('casr:CouchDbSecurity')('separate()');

    var a = this;

    if(b.admins) {
      if(b.admins.names)
        a.admins.names = a.admins.names.filter(elm => b.admins.names.indexOf(elm) == -1);
      if(b.admins.roles)
        a.admins.roles = a.admins.roles.filter(elm => b.admins.roles.indexOf(elm) == -1);
    }
    if(b.members) {
      if(b.members.names)
        a.members.names = a.members.names.filter(elm => b.members.names.indexOf(elm) == -1);
      if(b.members.roles)
        a.members.roles = a.members.roles.filter(elm => b.members.roles.indexOf(elm) == -1);
    }

    return this;
  }

  has(group, target, value) {
    _debug('casr:CouchDbSecurity')('has()');

    if(group && target && value)
      return this[group][target].indexOf(value) != -1;
    else if(group && target && !value)
      return this[group][target].length;
    else if(group && !target && !value)
      return !!(this[group] && this[group].names && this[group].roles);
  }

  add(group, target, value) {
    _debug('casr:CouchDbSecurity')('add()');

    var uniConcat = CouchDbSecurity.uniConcat;

    if(group && target && value)
      this[group][target] = this[group][target].concat(value);
    else if(group && target && !value && (target.names || target.roles)) {
      if(target.names)
        this[group].names = uniConcat(this[group].names, target.names);
      if(target.roles)
        this[group].roles = uniConcat(this[group].roles, target.roles);
    }
    else if(group && !target && !value && (group.admins || group.members))
      this.merge(group);
    else
      _debug('casr:CouchDbSecurity')('add() no valid arguments.');

    return this;
  }

  rem(group, target, value) {
    _debug('casr:CouchDbSecurity')('rem()');

    if(group && target && value)
      if(Array.isArray(value))
        this[group][target] = this[group][target].filter(elm => value.indexOf(elm) == -1);
      else
        this[group][target] = this[group][target].filter(elm => elm != value);
    else if(group && target && !value && (target.names || target.roles)) {
      if(target.names)
        this[group].names = this[group].names.filter(elm => target.names.indexOf(elm) == -1);
      if(target.roles)
        this[group].roles = this[group].roles.filter(elm => target.roles.indexOf(elm) == -1);
    }
    else if(group && !target && !value && (group.admins || group.members))
      this.separate(group);
    else
      _debug('casr:CouchDbSecurity')('rem() no valid arguments.');

    return this;
  }
}


module.exports = {
  Base,
  User,
  CouchDbSecurity
}
