console.log("api.js");

const port = 1337;
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const connection = require('./mysql-config');
const app = express();
const manageDB = require('./manageDB');

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, UPDATE, DELETE");
  next();
});
app.use(session({secret: 'sssshhh'}));

itemCounter = 0;

var creator;
var sess;

//connection.connect(function(error) {
//	if (error) {
//		console.log('Error', error);
//	} else {
//		console.log('Mysql Connected');
//	}
//});

//connection.query('SELECT * FROM users', function(err, rows, fields) {
//	if (!err) {
//		console.log('The solution is: ', rows);
//	} else {
//		console.log('error');
//	};
//});

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

app.get('/', function(req, res) {
    sess = req.session;
    
    if (sess.email) {
        res.redirect('/gigs');
    } else {
        res.render('index.html');
    }
})

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
		
		res.send(newGig);
	} else {
		console.log(req.body);
		res.status(400).send('Error creating gig');
	}
});

app.put('/gigs/:gig_id', function(req, res) {
	console.log('update');
    
});

app.post('/login', function(req, res) {
    
    sess = req.session;
    sess.email = req.body.email;
    res.end('done');
})

// app.use(express.static("public"));

app.listen(port, function () {
	console.log('Sidegig API listening on port '+port+'!');
});