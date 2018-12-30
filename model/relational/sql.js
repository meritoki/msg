exports.selectNameUser = function (name) {
    return 'SELECT u.id, u.idAccount, u.name, u.password, u.registerDate, u.activityDate, u.login, u.role, e.address AS email FROM auth.User u LEFT OUTER JOIN msg.Email e ON e.idUser=u.id WHERE name = \'' + name + '\';';
};

exports.selectEmail = function(user) {
  var sql = "";
  if(user.idConsumer != null) {
    sql += this.selectConsumerEmail(user.idConsumer);
  } else if(user.idDonor != null) {
    sql += this.selectDonorEmail(user.idConsumer);
  } else if(user.idAgent != null) {
    sql += this.selectAgentEmail(user.idConsumer);
  }
  return sql;
}

exports.selectPhone = function(user) {
  var sql = "";
  if(user.idConsumer != null) {
    sql += this.selectConsumerPhone(user.idConsumer);
  }
  return sql;
}


exports.selectConsumerPhone = function(id) {
    return 'SELECT consumerPhone.idConsumer, phone.id AS idPhone, phone.number '+
           'FROM msg.ConsumerPhone consumerPhone '+
           'LEFT OUTER JOIN msg.Phone phone ON phone.id = consumerPhone.idPhone '+
           'WHERE consumerPhone.idConsumer = '+id+';';
}

exports.selectConsumerEmail = function(id) {
    return 'SELECT consumerEmail.idConsumer, email.id AS idEmail, email.address '+
             'FROM msg.ConsumerEmail consumerEmail '+
             'LEFT OUTER JOIN msg.Email email ON email.id = consumerEmail.idEmail '+
             'WHERE consumerEmail.idConsumer = '+id+';'
}


exports.selectDonorEmail = function(id) {
    return 'SELECT donorEmail.idDonor, email.id AS idEmail, email.address '+
             'FROM msg.DonorEmail donorEmail '+
             'LEFT OUTER JOIN msg.Email email ON email.id = donorEmail.idEmail '+
             'WHERE donorEmail.idDonor = '+id+';'
}

exports.selectAgentEmail = function(id) {
    return 'SELECT agentEmail.idAgent, email.id AS idEmail, email.address '+
             'FROM msg.AgentEmail agentEmail '+
             'LEFT OUTER JOIN msg.Email email ON email.id = agentEmail.idEmail '+
             'WHERE agentEmail.idAgent = '+id+';'
}


exports.selectMerchantEmail = function(id) {
    return 'SELECT merchantEmail.idMerchant, email.id AS idEmail, email.address '+
             'FROM msg.MerchantEmail merchantEmail '+
             'LEFT OUTER JOIN msg.Email email ON email.id = merchantEmail.idEmail '+
             'WHERE merchantEmail.idMerchant = '+id+';'
}

exports.selectCustomerEmail = function(id) {
    return 'SELECT customerEmail.idCustomer, email.id AS idEmail, email.address '+
             'FROM msg.CustomerEmail customerEmail '+
             'LEFT OUTER JOIN msg.Email email ON email.id = customerEmail.idEmail '+
             'WHERE customerEmail.idCustomer = '+id+';'
}

exports.insertPhone = function(phone) {
  var sql = "INSERT INTO msg.Phone (number) VALUES (\""+phone.number+"\");"+
         "SET @idPhone = LAST_INSERT_ID(); "
         if(phone.idDonor != undefined) {
           sql+="INSERT INTO msg.DonorPhone(idDonor,idPhone) VALUES ("+phone.idDonor+",@idPhone);"
        } else if (phone.idAgent != undefined) {
          sql+="INSERT INTO msg.AgentPhone(idAgent,idPhone) VALUES ("+phone.idAgent+",@idPhone);"
        } else if (phone.idConsumer != undefined) {
          sql+="INSERT INTO msg.ConsumerPhone(idConsumer,idPhone) VALUES ("+phone.idConsumer+",@idPhone);"
        }
         sql+="COMMIT;"
         return sql;
}

exports.insertEmail = function(email) {
  var sql = "INSERT INTO msg.Email (address) VALUES (\""+email.address+"\");"+
         "SET @idEmail = LAST_INSERT_ID(); "
         if(email.idDonor != undefined) {
           sql+="INSERT INTO msg.DonorEmail(idDonor,idEmail) VALUES ("+email.idDonor+",@idEmail);"
        } else if (email.idAgent != undefined) {
          sql+="INSERT INTO msg.AgentEmail(idAgent,idEmail) VALUES ("+email.idAgent+",@idEmail);"
        } else if (email.idConsumer != undefined) {
          sql+="INSERT INTO msg.ConsumerEmail(idConsumer,idEmail) VALUES ("+email.idConsumer+",@idEmail);"
        }
         sql+="COMMIT;"

         return sql;
}
