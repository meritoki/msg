var properties = require('../../properties.js');
var msg = require('../msg.js');

exports.delete = function(router) {
  console.log('service.path.delete()');
};

exports.get = function(router) {
  console.log('service.path.get()');
};

exports.post = function(router) {
  console.log('service.path.post()');
  router.post("/v1/msg/email/id",msg.postIDEmail);
  router.post("/v1/msg/email/consumer/id",msg.postEmailIDConsumer);
  router.post("/v1/msg/phone/consumer/id",msg.postPhoneIDConsumer);

  router.post("/v1/msg/email/verification/send", msg.postVerificationSend);

  router.post("/v1/msg/email", msg.postEmail);
  router.post("/v1/msg/phone", msg.postPhone);


};
