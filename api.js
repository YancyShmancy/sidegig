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
};


// main storage of items in memory
var gigs = [];

console.log(gigs);

// fetch saved copy of list

app.get('/gigs', function(req, res) {
	
	connection.query('SELECT * FROM gigs', function(err, rows, fields) {
		gigs = rows;
		res.send(gigs);
	});
});

app.get('/gigs/:gig_id', function(req, res) {
	connection.query('SELECT * FROM gigs WHERE id=' + req.params.gig_id, function(err, rows, fields) {
		res.send(rows[0]);
	});
});

app.post('/gigs/', function(req, res) {
	var newGig;
	if (req.body.title) {
		newGig = new gig(req.body.title.trim(), req.body.description);
		console.log(newGig);
		gigs.push(newGig);
		
		connection.query('INSERT INTO gigs (id, title, description, creator, created_at, updated_at) VALUES('+newGig.id+', "'+newGig.title+'", "'+newGig.description+'", "'+newGig.creator+'", '+newGig.created_at+', '+newGig.updated_at+')', function(err, rows, fields) {
			console.log(err, rows, fields);
		});
		
		res.send(gigs);
	} else {
		console.log(req.body);
		res.status(400).send('Error creating gig');
	}
});

app.put('/gigs/:gig_id', function(req, res) {
	console.log('update');
});

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