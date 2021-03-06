/*
  msg
 */
var relational = require('../../model/relational.js');
var properties = require('../properties.js');
// var nodemailer = require("nodemailer");
var twilio = require('twilio');
var client = new twilio.RestClient('AC3bc642a06bdd2fe29860533605629696', '9e7e573393f4dba697de92a73d59651f');
var http = require('http');
var bodyParser = require('body-parser');
var nodemailer = require("nodemailer");
var redis = require('redis');
var redisClient = redis.createClient(); // default setting.
var mandrillTransport = require('nodemailer-mandrill-transport');
var async = require('async');
var smtpTransport = nodemailer.createTransport('smtps://jorodriguez1988@gmail.com:rohrWaka@22001188@smtp.gmail.com');


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

var textMessage = function (to, from, body, complete) {
    client.sms.messages.create({
        body: body,
        to: to,
        from: from
    }, complete);
}



exports.postVerificationSend = function(req, res) {
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
        from : 'meritoki@yahoo.com',
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

exports.postEmailIDConsumer = function(req, res, next) {
  var id = req.body.idConsumer;
  relational.getEmailConsumer(id, function (error, location) {
    if (error) {
      console.log(error);
      var status = 500;
      res.status(status).end(http.STATUS_CODES[status]);
    } else {
      res.end(JSON.stringify(location));
    }
  });
};

exports.postPhoneIDConsumer = function(req, res, next) {
  var id = req.body.idConsumer;
  relational.getPhoneConsumer(id, function (error, location) {
    if (error) {
      console.log(error);
      var status = 500;
      res.status(status).end(http.STATUS_CODES[status]);
    } else {
      res.end(JSON.stringify(location));
    }
  });
};

// exports.postEmail = function (req, res, next) {
//   res.end("email send");
//     // var to = req.body.to;
//     // var from= req.body.from;
//     // var replyTo= req.body.replyTo;
//     // var subject= req.body.subject;
//     // var text= req.body.text;
//     // var html = req.body.html;
//     // var smtpTransport = nodemailer.createTransport("SMTP", {
//     //     service: properties.email.service,
//     //     auth: {
//     //         user: properties.email.address,
//     //         pass: properties.email.password
//     //     }
//     // });
//     // var option = {
//     //     to: to,
//     //     from: from,
//     //     replyTo: replyTo,
//     //     subject: subject,
//     //     text: text,
//     //     html: html
//     // };
//     // smtpTransport.sendMail(option, function (error, response) {
//     //     if (error) {
//     //         console.log(error);
//     //         res.end(error);
//     //
//     //     } else {
//     //         console.log(response.message);
//     //         smtpTransport.close();
//     //         res.end(response);
//     //     }
//     //
//     // });
// }
//
// exports.postSMS = function (req, res, next) {
//     console.log('postSMS');
//     var to = req.body.to;
//     var m = req.body.message;
//     textMessage(to, properties.phone.from, m, function (error, message) {
//         if (!error) {
//             console.log(message.sid);
//             res.end(message);
//         } else {
//             res.end(error);
//         }
//     });
// }
