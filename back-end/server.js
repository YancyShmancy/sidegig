console.log("server.js running bitches");

const express = require('express');
const _ = require('underscore');
const bodyParser = require('body-parser');
const db = require('./db.js');
const bcrypt = require('bcrypt');
const middleware = require('./middleware.js')(db);
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 4000;
const gigs = [];
const nextGigID = 1;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, UPDATE, DELETE");
	next();
});

app.use(function(req, res, next) {
	console.log(req.url);
	next();
});

app.get('/authenticate', middleware.requireAuthentication, function(req, res) {
	
	res.json(req.user.toPublicJSON());
})

app.get('/logout', middleware.requireAuthentication, function(req, res) {
	
	res.cookie('Auth', 'undefined').send();
})

app.get('/gigs', function(req, res) {
	
	db.gig.findAll().then(function(gigs) {
		res.json(gigs);
	}, function(e) {
		console.log(e);
		res.status(500).send(e);
	})
});

app.get('/gigs/:gig_id', function(req, res) {
	
	db.gig.findOne({
		where: {
			id: req.params.gig_id
		}
	}).then(function(gig) {
		
		if (!!gig) {
			res.json(gig.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send(e);
	});
})

app.get('/gigs/category/:category_name', function(req, res) {
	
	db.gig.findAll({
		where: {
			category: req.params.category_name
		}
	}).then(function(gigs) {
		console.log(gigs);
		res.json(gigs);
	}, function(e) {
		res.status(500).send(e);
	})
})

app.post('/gigs', middleware.requireAuthentication, function(req, res) {
	
	console.log(req.cookies);
	
	var body = {
		title: req.body.title,
		description: req.body.description,
		category: req.body.category,
		rolesFilled: req.body.rolesFilled,
		rolesNeeded: req.body.rolesNeeded
	}
	
	db.gig.create(body).then(function(gig) {
		res.json(gig);
		req.user.addGig(gig).then(function(gig) {
			return gig.reload();
		}).then(function(gig) {
			res.json(gig.toJSON());
		})
	}, function(e) {
		res.status(400).toJSON(e);
	})
})

app.post('/users', function(req, res) {
	var body = _.pick(req.body, 'username', 'password', 'email', 'firstname', 'lastname');
	
	console.log(body);
	db.user.create(body).then(function(user) {
		res.json(user.toPublicJSON());
	}, function(e) {
		res.status(400).send(e);
	});
});

app.post('/users/login', function(req, res) {
	var body = {
		username: req.body.username,
		password: req.body.password
	}
	
	db.user.authenticate(body).then(function(user) {
		res.cookie('Auth', user.generateToken('authentication'), {
			maxAge: 900000,
			secure: false
		}).json(user.toPublicJSON());
	}, function(e) {
//		console.error(e);
		res.status(401).send();
	});
});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});