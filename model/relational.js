var database = require('./database.js');
var sql = require('./relational/sql.js');
var bcrypt = require('bcryptjs');
var email = require('./object/email.js');
var phone = require('./object/phone.js');
var user = require('./object/user.js');

exports.getNameUser = function(name, callback) {
  console.log('relational.getNameUser');
  if (typeof name !== "undefined") {
    database.getQueryResult(sql.selectNameUser(name), function(err, result) {
      u = null;
      if (result !== undefined && result != null && result.length > 0) {
        u = new user();
        u.idUser = result[0].id;
        u.idAccount = result[0].idAccount;
        u.name = result[0].name;
        u.email = result[0].email;
        u.role = result[0].role;
        u.password = result[0].password;
        u.active = result[0].active;
      } else {
        return callback(new Error("user is null"), null);
      }
      return callback(err, u);
    });
  } else {
    return callback(new Error("typeof name === \"undefined\""), null);
  }
};

exports.setActive = function(name, callback) {
  if (typeof name !== "undefined") {
    database.getQueryResult(sql.updateUser(name), function(err, result, fields) {
      if (err) {
        callback(err, null);
      }
      callback(null, true);
    });
  } else {
    callback(new Error("typeof user === \"undefined\""), null);
  }
};

exports.setPhone = function(location, callback) {
  if (typeof location !== "undefined") {
    database.getQueryResult(sql.insertPhone(location), function(err, result, fields) {
      if (err) {
        callback(err, null);
      }
      callback(null, true);
    });
  } else {
    callback(new Error("typeof user === \"undefined\""), null);
  }
};

exports.setEmail = function(location, callback) {
  if (typeof location !== "undefined") {
    database.getQueryResult(sql.insertEmail(location), function(err, result, fields) {
      if (err) {
        callback(err, null);
      }
      callback(null, true);
    });
  } else {
    callback(new Error("typeof user === \"undefined\""), null);
  }
};



exports.getEmail = function(user, callback) {
  if (typeof user !== "undefined") {
    database.getQueryResult(sql.selectEmail(user), function(err, result) {
      var e = new email();
      if (result !== undefined && result != null && result.length > 0) {
        e.idUser = result[0].idUser;
        e.idAgent = result[0].idAgent;
        e.idMerchant = result[0].idMerchant;
        e.idConsumer = result[0].idConsumer;
        e.idCustomer = result[0].idCustomer;
        e.idDonor = result[0].idDonor;
        e.idEmail = result[0].idEmail;
        e.address = result[0].address;
      }
      return callback(null, e);
    });
  } else {
    return callback(new Error("typeof name === \"undefined\""), null);
  }
};

exports.getPhone = function(user, callback) {
  if (typeof user !== "undefined") {
    database.getQueryResult(sql.selectPhone(user), function(err, result) {
      var e = new phone();
      if (result !== undefined && result != null && result.length > 0) {
        e.idUser = result[0].idUser;
        e.idAgent = result[0].idAgent;
        e.idMerchant = result[0].idMerchant;
        e.idConsumer = result[0].idConsumer;
        e.idCustomer = result[0].idCustomer;
        e.idDonor = result[0].idDonor;
        e.idPhone = result[0].idPhone;
        e.number = result[0].number;
      }
      return callback(null, e);
    });
  } else {
    return callback(new Error("typeof name === \"undefined\""), null);
  }
};
