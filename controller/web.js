/*
 * Name: web.js
 * Author: Joaquin Rodriguez
 * Copyright: 2018 Meritoki
 * Date: 2018/07
 * Reference: http://www.clock.co.uk/blog/a-simple-website-in-nodejs-with-express-jade-and-stylus
 * Reference: https://www.codementor.io/nodejs/tutorial/build-website-from-scratch-using-expressjs-and-bootstrap
 * Reference: http://stackoverflow.com/questions/21194934/node-how-to-create-a-directory-if-doesnt-exist
 * Reference: http://passportjs.org/docs
 * Reference: http://stackoverflow.com/questions/27961320/when-should-i-use-cookie-parser-with-express-session
 */
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var properties = require('./properties.js');

var header = require('./interface/header.js');
var security = require('./interface/security.js');
var protocol = require('./interface/protocol.js');
var servicePath = require('./interface/service/path.js');
var web = express();

console.log(properties.name);
console.log("version "+properties.version);
security.log(web);

web.use(express.static(__dirname + '/public'));

web.use(bodyParser.urlencoded({
  extended: false,
  limit: '50mb'
}));

web.use(bodyParser.json({
  limit: '50mb'
}))

web.use(cookieParser(properties.cookie.secret));
web.use(session({
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: properties.session.maxAge
  },
  secret: properties.session.secret
}));
web.use(function(req, res, next){header.initialize(req, res, next)});

servicePath.delete(web);
servicePath.get(web);
servicePath.post(web);

protocol.initialize(web);
