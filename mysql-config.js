const mysql = require('mysql');

var connection = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
	port: 8889,
	database: 'sidegig',
	multipleStatements: true
});

module.exports = connection;