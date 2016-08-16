console.log("createTables.js");

const port = 1336;
const mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	port: '8889',
	database: 'sidegig',
	multipleStatements: true
});

connection.connect(function(error) {
	if (error) {
		console.log('Error', error);
	} else {
		console.log('Mysql Connected');
	}
});

connection.query('CREATE TABLE users(id int(11) NOT NULL, firstname varchar(50), lastname varchar(50), username varchar(32), password varchar(64), email varchar(100)) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5', function(err, rows, fields) {
	if (err) {
		console.log('Error creating user table', err);
	} else {
		console.log(rows, fields);
	}
} );

connection.query('CREATE TABLE gigs(id int(11) NOT NULL, title varchar(50), description varchar(255), creator varchar(50), created_at int(50), updated_at int(50))', function(err, rows, fields) {
	if (err) {
		console.log('Error creating gigs table', err);
	} else {
		console.log(rows, fields);
	}
});

connection.query('CREATE TABLE comments(id int(11) NOT NULL, user varchar(50), content varchar(255), submitted_at int(50))', function(err, rows, fields) {
	if (err) {
		console.log('Error creating comments table', err);
	} else {
		console.log(rows, fields);
	}
});
