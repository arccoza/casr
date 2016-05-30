var nurl = require('url');
var sift = require('sift');
var PouchDB = require('pouchdb');
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

    console.log(dbName)

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
  enablePermissions() {
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
      op: utils.toPromise((op, group, target, value, callback) => {
        // if(arguments.length < 4 && )
        console.log(arguments[0])

        this.permissions.get()
          .then(res => {
            if(op == 'merge')
              return new CouchDbSecurity(res)[op](value);
            else
              return new CouchDbSecurity(res)[op](group, target, value);
          })
          .then(res => {
            this.permissions.put(res, callback);
          })
          .catch(callback);
      }),
      merge: utils.toPromise((obj, callback) => {
        this.permissions.op('merge', obj, callback);
      }),
      add: utils.toPromise((group, target, value, callback) => {
        this.permissions.op('add', group, target, value, callback);
      }),
      rem: utils.toPromise((group, target, value, callback) => {
        this.permissions.op('rem', group, target, value, callback);
      }),
      addAdminUser: utils.toPromise((user, callback) => {
        this.permissions.op('add', 'admins', 'names', user, callback);
      }),
      remAdminUser: utils.toPromise((user, callback) => {
        this.permissions.op('rem', 'admins', 'names', user, callback);
      }),
      addAdminRole: utils.toPromise((role, callback) => {
        this.permissions.op('add', 'admins', 'roles', role, callback);
      }),
      remAdminRole: utils.toPromise((role, callback) => {
        this.permissions.op('rem', 'admins', 'roles', role, callback);
      }),
      addMemberUser: utils.toPromise((user, callback) => {
        this.permissions.op('add', 'members', 'names', user, callback);
      }),
      remMemberUser: utils.toPromise((user, callback) => {
        this.permissions.op('rem', 'members', 'names', user, callback);
      }),
      addMemberRole: utils.toPromise((role, callback) => {
        this.permissions.op('add', 'members', 'roles', role, callback);
      }),
      remMemberRole: utils.toPromise((role, callback) => {
        this.permissions.op('rem', 'members', 'roles', role, callback);
      }),
    }

    return this.permissions;
  }
}

module.exports = plugs;
