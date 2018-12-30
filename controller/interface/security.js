var fs = require('fs');
var morgan = require('morgan');
var properties = require('../properties.js');
var directory = require('./directory.js');

exports.configuration = function(){
  console.log('security.configuration');
  var key = fs.readFileSync(properties.security.keyPath).toString();
  var certificate = fs.readFileSync(properties.security.certificatePath).toString();
  var configuration = {
    key: key,
    cert: certificate,
    ca: [
      fs.readFileSync(properties.security.certificateExternalCAPath).toString(),
      fs.readFileSync(properties.security.certificateTrustCAPath).toString(),
      fs.readFileSync(properties.security.certificateDomainValidationPath).toString()
    ]
  };
  return configuration;
}

exports.log = function(app){
  directory.make(properties.log.path, 0755, function(err) {
    if (!err) {
      fs.writeFile(properties.log.path + properties.log.filename);
      app.use(morgan("combined", {
        stream: fs.createWriteStream(properties.log.path + properties.log.filename, {
          flags: 'a'
        })
      }));
    }
  });
}
