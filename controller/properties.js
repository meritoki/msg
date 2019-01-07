/*
 * Name: properties.js
 * Author: Joaquin Osvaldo Rodriguez
 * Date: 201807
 * Copyright: 2018 Meritoki 2018 All Rights Reserved
 */
var properties = {}

properties.name = "msg";
properties.version = "0.2";
properties.port = {};
properties.port.http = '3004';
properties.port.https = '8443';
properties.https = false;
properties.host = 'metanoia.com';
//service
properties.web = {};
properties.web.service = {};
properties.web.service.https = 8443;
properties.web.service.http = 3004;
properties.web.service.session = {};
properties.web.service.session.maxAge = 7200000; //1 hour in milliseconds
properties.web.service.session.secret = 'color';

properties.email = {};
properties.email.address = 'admin@meritoki.com';
properties.email.password = 'rohrWaka@22001188';

//security
properties.security = {};
properties.security.keyPath = './controller/security/key/key.pem';
properties.security.certificatePath = './controller/security/certificate/*/*.crt';
properties.security.certificateExternalCAPath = './controller/security/certificate/*/*.crt';
properties.security.certificateTrustCAPath = './controller/security/certificate/*/*.crt';
properties.security.certificateDomainValidationPath = './controller/security/certificate/*/*.crt';
//database
properties.database = {};
properties.database.vendor = 'mysql';
properties.database.schema = 'user';
properties.database.hostname = 'localhost';
properties.database.password = 'ncrsb';
properties.database.username = 'root';
//log
properties.log = {};
properties.log.path = '/var/log/meritoki/dailybread/service/user';
properties.log.filename = 'app.express';
//cookie/session
properties.cookie = {};
properties.cookie.secret = '123';
properties.session = {};
properties.session.maxAge = 7200000; //1 hour in milliseconds
properties.session.secret = 'color';

module.exports = properties;
