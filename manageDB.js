const connection = require('./mysql-config');

exports.executeQuery = function(query, callback) {
    connection.getConnection(function(err, connection) {
        if (err) {
            connection.release();
        }
        
        connection.query(query, function(err, rows) {
            connection.release();
            if(!err) {
                callback(null, rows);
            }
        });
        
        connection.on('error', function(err) {
            throw err;
            return;
        })
    })
}