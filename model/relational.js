var database = require('./database.js');
var sql = require('./relational/sql.js');
var bcrypt = require('bcryptjs');
var email = require('./object/email.js');
var phone = require('./object/phone.js');

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
  if (typeof id !== "undefined") {
    database.getQueryResult(sql.selectEmail(user), function(err, result) {
      var e = null;
      if (result !== undefined && result != null && result.length > 0) {
        e = new email();
        e.idConsumer = result[0].idConsumer;
        e.idEmail = result[0].idEmail;
        e.address = result[0].address;
      } else {
        return callback(new Error("id is null"), null);
      }
      return callback(err, e);
    });
  } else {
    return callback(new Error("typeof name === \"undefined\""), null);
  }
};



exports.getEmailConsumer = function(id, callback) {
  if (typeof id !== "undefined") {
    database.getQueryResult(sql.selectConsumerEmail(id), function(err, result) {
      var e = null;
      if (result !== undefined && result != null && result.length > 0) {
        e = new email();
        e.idConsumer = result[0].idConsumer;
        e.idEmail = result[0].idEmail;
        e.address = result[0].address;
      } else {
        return callback(new Error("id is null"), null);
      }
      return callback(err, e);
    });
  } else {
    return callback(new Error("typeof name === \"undefined\""), null);
  }
};

exports.getPhoneConsumer = function(id, callback) {
  if (typeof id !== "undefined") {
    database.getQueryResult(sql.selectConsumerPhone(id), function(err, result) {
      var p = null;
      if (result !== undefined && result != null && result.length > 0) {
        p = new phone();
        p.idConsumer = result[0].idConsumer;
        p.idEmail = result[0].idEmail;
        p.number = result[0].number;
      } else {
        return callback(new Error("id is null"), null);
      }
      return callback(err, p);
    });
  } else {
    return callback(new Error("typeof name === \"undefined\""), null);
  }
};
