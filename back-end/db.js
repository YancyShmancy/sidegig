const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
var sequelize;

if (env == 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});
} else {
	sequelize = new Sequelize('sidegig2', 'root', 'root', {
		dialect: 'mysql',
		port: 8889,
		host: 'localhost'
	});
}

var db = {};

db.gig = sequelize.import(__dirname + '/models/gig.js');
db.user = sequelize.import(__dirname + '/models/user.js');
db.comment = sequelize.import(__dirname + '/models/comment.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.gig.belongsTo(db.user);
db.user.hasMany(db.gig);
db.comment.belongsTo(db.gig);
db.gig.hasMany(db.comment);
db.user.hasMany(db.comment);
db.comment.belongsTo(db.user);

module.exports = db;