module.exports = function(sequelize, DataTypes) {
	var gig = sequelize.define("Gig", {
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		category: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				isAlpha: true
			}
		},
		rolesFilled: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		rolesNeeded: {
			type: DataTypes.INTEGER,
			allowNull: true,
		}
	})
	
	return gig;
}