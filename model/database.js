var properties = require('../controller/properties.js');
var mysql = require('mysql');

exports.setProperties = function (p) {
    properties = p;
}

var getMySQLDatabase = function () {
    function addDisconnectHandler(connection) {
        connection.on("error", function (error) {
            if (error instanceof Error) {
                if (error.code = "PROTOCOL_CONNECTION_LOST") {
                    getConnection(connection.config);
                } else if (error.fatal) {
                    throw error;
                }
            }

        });
    }
    var connection = mysql.createConnection({
        host: properties.database.hostname,
        user: properties.database.username,
        password: properties.database.password,
        multipleStatements: true
    });
    addDisconnectHandler(connection);
    connection.connect();
    connection.query('use ' + properties.database.schema);
    return connection;
};

exports.getQueryResult = function (query, callback) {
    console.log("database.getQueryResult " + query + "");
    var database = null;
    if (properties.database.vendor == 'mysql') {
        try {
            database = getMySQLDatabase();
            database.query(query, function (err, result) {
                if (err) {
                    return callback(err, null);
                } else {
                    database.end();
                    return callback(err, result);
                }
            });
        } catch (ex) {
            console.log(ex);
        } finally {
            if (database != null && database.state != "disconnected") {
                database.end();
            }
        }
    }
};
