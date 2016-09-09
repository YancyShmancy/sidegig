console.log("api.js");

const port = 1337;
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const connection = require('./mysql-config');
const cookieParser = require('cookie-parser');
const validator = require('email-validator');
const CryptoJS = require('crypto-js');
const authenticate = require('./authenticator.js');
const MySQLStore = require('connect-mysql')(session);
const config = require('./connect-mysql-config.js');
const uuid = require('uuid');
const parseurl = require('parseurl');
const app = express();


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
//app.use(MySQLStore(express));
app.set('trust proxy', 1);
app.use(session({
	genid: function(req) {
		return uuid.v4(); // use UUIDs for session IDs
	},
	name: 'session',
//	store: new MySQLStore(config),
	secret: 'sssshhh',
	resave: false,
	saveUnitialized: true,
	cookie: {
		name: 'session',
		secure: true
	}
}));

app.use(function (req, res, next) {
  var views = req.session.views

  if (!views) {
    views = req.session.views = {}
  }

  // get the url pathname
  var pathname = parseurl(req).pathname

  // count the views
  views[pathname] = (views[pathname] || 0) + 1

  next()
})

itemCounter = 0;

var creator;
var user;

var gig = function(title, description, category) {
	this.title = title;
	this.description = description;
	this.category = category;
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
    res.send(req.session);
//    if (sess.email) {
//        res.redirect('/gigs');
//    } else {
//        res.redirect('/gigs');
//    }
});

app.get('/gigs', function(req, res) {
	connection.query('SELECT * FROM gigs', function(err, rows, fields) {
		gigs = rows;
		res.send(gigs);
	});
});

app.get('/gigs/:gig_id', function(req, res) {
	connection.query('SELECT * FROM gigs WHERE id=' + req.params.gig_id, function(err, rows, fields) {
		if (err) {
			console.log(err);
		} else {
			res.send(rows[0]);
		}
	});
});

app.get('/gigs/category/:category_name', function(req, res) {
	
	connection.query('SELECT * FROM gigs WHERE category="'+req.params.category_name+'"', function(err, rows, fields) {
		if (err) {
			res.send(err).status(400);
		} else {
			gigs = rows;
			res.send(gigs);
		}
	})
})

app.post('/gigs/', function(req, res) {

	var newGig;
	if (req.body.title) {
		newGig = new gig(req.body.title.trim(), req.body.description, req.body.category);
		
		connection.query('INSERT INTO gigs (title, description, category, creator, created_at, updated_at) VALUES("'+newGig.title+'", "'+newGig.description+'", "'+newGig.category+'", "'+newGig.creator+'", '+newGig.created_at+', '+newGig.updated_at+')', function(err, result) {
			
			if(err) {
				// handle err
			} else {
//				newGig.id = rows[0].id;
				console.log(newGig);
				itemCounter = result.insertId;
				newGig.id = result.insertId;
				gigs.push(newGig);
				res.send(newGig);
			}
		});
		
		
	} else {
		console.log(req.body);
		res.status(400).send('Error creating gig');
	}
});

app.put('/gigs/:gig_id', function(req, res) {
	console.log('update');
    
});

app.post('/users', function(req, res) {
	
	if (validator.validate(req.body.email) 
		&& req.body.password 
		&& req.body.firstname
	    && req.body.lastname
	    && req.body.username) {
		
		var password = CryptoJS.MD5(JSON.stringify(req.body.password), 'abc1234');
		var firstname = req.body.firstname;
		var lastname = req.body.lastname;
		var email = req.body.email;
		var username = req.body.username;
		
		connection.query('INSERT INTO users (firstname, lastname, username, password, email, role) VALUES("'+firstname+'", "'+lastname+'", "'+username+'", "'+password+'", "'+email+'", "guest")', function(err, result) {
			
			if(err) {
				console.log(err);
				res.status(400);
			} else {
				res.send("Success");
			}
		});
	} else {
		
		res.send("error").status(400);
	}
});

app.post('/users/login', function(req, res) {
	var username = req.body.username;
	var password = CryptoJS.MD5(JSON.stringify(req.body.password), 'abc1234');
	var user;
	
	if (validator.validate(username)) {
		
		connection.query('SELECT * FROM users WHERE email="'+username+'"', function(err, result) {
			
			if (err) {
				console.log(err);
				res.send(err).status(400);
			} else {
				user = result[0];
				
				if (user.password == password) {
//					req.session.email = user.email;
//					req.session.firstname = user.firstname;
//					req.session.lastname = user.lastname;
//					req.session.username = user.username;
//					req.session.save();
					req.session.user = user;
					req.session.sessionID = req.sessionID;
					req.session.cookie.expires = new Date(Date.now() + 3600000);
					res.send(req.session);
				} else {
					res.send("Incorrect username or password").status(400);
				}
			}
		});
	} else if (username) {
		
		connection.query('SELECT * FROM users WHERE username="'+username+'"', function(err, result) {
			
			if (err) {
				res.send(err).status(400);
			} else {
				user = result[0];
				
				if (user.password == password) {
//					req.session.email = user.email;
//					req.session.firstname = user.firstname;
//					req.session.lastname = user.lastname;
//					req.session.username = user.username;
//					req.session.save();
					req.session.sessionID = req.sessionID;
					req.session.user = user;
					req.session.cookie.expires = new Date(Date.now() + 3600000)
					res.send(req.session);
					
				} else {
					res.send("Incorrect username or password").status(400);
				}
			}
		});
		
	} else {
		console.log("error");
		res.send("Error").status(400);
	}
	
//	res.send(req.session.user);
});

// app.use(express.static("public"));
app.listen(port, function () {
	console.log('Sidegig API listening on port '+port+'!');
});