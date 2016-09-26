'use strict';

module.exports = function(sequelize, DataTypes) {
	
	var comment = sequelize.define('comment', {
		content: {
			type: DataTypes.STRING,
			allowNull: false
		},
		user: {
			type: DataTypes.STRING,
			allowNull: false
		}
	});
	
	return comment;
}