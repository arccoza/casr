'use strict'
var Ajv = require('ajv');


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

module.exports = {
  Base,
  User
}
