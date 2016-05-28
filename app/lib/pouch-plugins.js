var nurl = require('url');
var sift = require('sift');
var PouchDB = require('pouchdb');
var utils = require('./pouch-utils');


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
        }, callback);
      }),
      add: utils.toPromise((obj, callback) => {
        this.permissions.get()
        this.request({
          method: 'PUT',
          url: '_security',
          // headers : headers,
          body: JSON.stringify(obj)
        }, callback);
      }),
      rem: utils.toPromise((obj, callback) => {

      }),
      addAdminUser: utils.toPromise((user, callback) => {

      }),
      remAdminUser: utils.toPromise((user, callback) => {

      }),
      addAdminRole: utils.toPromise((role, callback) => {

      }),
      remAdminRole: utils.toPromise((role, callback) => {

      }),
      addMemberUser: utils.toPromise((user, callback) => {

      }),
      remMemberUser: utils.toPromise((user, callback) => {

      }),
      addMemberRole: utils.toPromise((role, callback) => {

      }),
      remMemberRole: utils.toPromise((role, callback) => {

      }),
    }

    return this;
  }
}

module.exports = plugs;
