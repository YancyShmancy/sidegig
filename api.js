console.log("api.js");

const port = 1337;
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, UPDATE, DELETE");
  next();
});

itemCounter = 0;

var creator;

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

connection.query('SELECT * FROM users', function(err, rows, fields) {
	if (!err) {
		console.log('The solution is: ', rows);
	} else {
		console.log('error');
	};
});

var gig = function(title, description) {
	this.title = title;
	this.description = description;
	this.id = itemCounter++;
	this.comments = null;
	this.creator = creator;
	this.completed = false;
	this.created_at = Date.now();
	this.updated_at = null;
	this.deleted_at = null;
	
	this.complete = function() {
		this.completed = !this.completed;
		this.updated_at = Date.now();
	}
	
	this.delete = function() {
		this.deleted_at = Date.now();
		this.updated_at = Date.now();
	}
};

// main storage of items in memory
var gigs = [
	new gig("Welcome!", "Welcome to your todo list!"),
];

// fetch saved copy of list

app.get('/gigs', function(req, res) {
	res.send(gigs);
})

var saveToFile = function() {
	
	var toStore = {
		itemCounter: itemCounter,
		items: items
	}
	fs.writeFile(dataFilePath, JSON.stringify(toStore), function(err) {
		console.error(err);
	});
}

// app.use(express.static("public"));

app.listen(port, function () {
	console.log('Sidegig API listening on port '+port+'!');
});