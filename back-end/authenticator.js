module.exports = function(req, res, next) {
	sess = req.session;
	
	if (sess.username) {
		return next();
	} 
	
	console.log('not logged in');
	res.send('Not logged in').status(400);
}