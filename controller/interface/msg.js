/*
  msg
 */
var relational = require('../../model/relational.js');
var properties = require('../properties.js');
var http = require('http');
var bodyParser = require('body-parser');
var nodemailer = require("nodemailer");
var redis = require('redis');
var redisClient = redis.createClient(); // default setting.
var mandrillTransport = require('nodemailer-mandrill-transport');
var async = require('async');
var smtpTransport = nodemailer.createTransport('smtps://'+properties.email.address+':'+properties.email.password+'@smtp.gmail.com');


exports.postEmail = function(req, res, next) {
  relational.setEmail(req.body, function (error, boolean) {
    if (error) {
      console.log(error);
      var status = 500;
      res.status(status).end(http.STATUS_CODES[status]);
    } else {
      res.end(JSON.stringify(boolean));
    }
  });
}

exports.postPhone = function(req, res, next) {
  relational.setPhone(req.body, function (error, boolean) {
    if (error) {
      console.log(error);
      var status = 500;
      res.status(status).end(http.STATUS_CODES[status]);
    } else {
      res.end(JSON.stringify(boolean));
    }
  });
}

exports.postIDEmail = function(req, res, next) {
  relational.getEmail(req.body, function (error, location) {
    if (error) {
      console.log(error);
      var status = 500;
      res.status(status).end(http.STATUS_CODES[status]);
    } else {
      res.end(JSON.stringify(location));
    }
  });
};

exports.postIDPhone = function(req, res, next) {
  relational.getPhone(req.body, function (error, location) {
    if (error) {
      console.log(error);
      var status = 500;
      res.status(status).end(http.STATUS_CODES[status]);
    } else {
      res.end(JSON.stringify(location));
    }
  });
};

exports.postEmailVerification = function(req, res) {
  console.log(req.body.to);
  async.waterfall([
    // Check if email already exists.
    // format to store in Redis is {email : unique key}
    function(callback) {
      redisClient.exists(req.body.to,function(err,reply) {
        if(err) {
          return callback(true,"Error in redis");
        }
        if(reply === 1) {
          return callback(true,"Email already requested");
        }
        callback(null);
      });
    },
    function(callback) {
      // Generating random string.
      var rand = Math.floor((Math.random() * 100) + 54);
      var encodedMail = new Buffer(req.body.to).toString('base64');
      // var link="http://"+req.get('host')+"/verify?mail="+encodedMail+"&id="+rand;
      var link="http://localhost/verify?mail="+encodedMail+"&id="+rand;
      var mailOptions={
        from : properties.email.address,
        to : req.body.to,
        subject : "Please confirm your Email account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
      };
      callback(null,mailOptions,rand);
    },
    function(mailData,secretKey,callback) {
      console.log(mailData);
      // Sending email using Mandrill.
      smtpTransport.sendMail(mailData, function(error, response){
         if(error){
          console.log(error);
          return callback(true,"Error in sending email");
       }
        console.log("Message sent: " + JSON.stringify(response));
        // Adding hash key.
        redisClient.set(req.body.to,secretKey);
        redisClient.expire(req.body.to,600); // setting expiry for 10 minutes.
        callback(null,"Email sent Successfully");
    });
    }
  ],function(err,data) {
    console.log(err,data);
    res.json({error : err === null ? false : true, data : data});
  });
}

exports.getVerify=  function(req, res) {
  var host = "localhost";
  // if((req.protocol+"://"+req.get('host')) === ("http://"+host)) {
      async.waterfall([
        function(callback) {
          let decodedMail = new Buffer(req.query.mail, 'base64').toString('ascii');
          redisClient.get(decodedMail,function(err,reply) {
            if(err) {
              return callback(true,"Error in redis");
            }
            if(reply === null) {
              return callback(true,"Invalid email address");
            }
            callback(null,decodedMail,reply);
          });
        },
        function(key,redisData,callback) {
          if(redisData === req.query.id) {
            redisClient.del(key,function(err,reply) {
              if(err) {
                return callback(true,"Error in redis");
              }
              if(reply !== 1) {
                return callback(true,"Issue in redis");
              }
              callback(null,"Email is verified");
            });
          } else {
            return callback(true,"Invalid token");
          }
        }
      ],function(err,data) {
        res.send(data);
      });
    // } else {
    //   res.end("<h1>Request is from unknown source");
    // }

}
