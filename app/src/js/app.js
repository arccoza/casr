import Vue from 'vue';
import PouchDB from 'pouchdb';
import plugs from '../../lib/pouch-plugins';


PouchDB.plugin(plugs);

var proxyDb = new PouchDB('http://localhost:8080/users', { skip_setup: true });
var users = proxyDb.users('users');

var remoteDb = new PouchDB('https://arccoza.cloudant.com/_users', { skip_setup: true });
var localDb = new PouchDB('users', { skip_setup: true });
var stores = localDb.stores();
