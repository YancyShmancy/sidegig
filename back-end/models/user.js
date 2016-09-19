const bcrypt = require('bcrypt');
const _ = require('underscore');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

module.exports = function(sequelize, DataTypes) {
	var user = sequelize.define("User", {
		username: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [7, 20]
			}
		},
		salt: {
			type: DataTypes.STRING
		},
		password_hash: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [7, 100]
			},
			set: function (value) {
				var salt = bcrypt.genSaltSync(10);
				var hashedPassword = bcrypt.hashSync(value, salt);
				
				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedPassword);
			}
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			validate: {
				notEmpty: true,
				isEmail: true
			}
		},
		firstname: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		lastname: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		}
	}, {
		hooks: {
			beforeValidate: function(user, options) {
				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}
		},
		classMethods: {
			authenticate: function(body) {
				
				return new Promise(function (resolve, reject) {
					if (typeof body.username !== 'string' || typeof body.password !== 'string') {
						return reject();
					}
					
					user.findOne({
						where: {
							username: body.username
						}
					}).then(function(user) {
						console.log(user);
						if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
							return reject();
						}
						
						resolve(user);
					}, function(e) {
						reject();
					})
				})
			},
			findByToken: function(token) {
				return new Promise(function (resolve, reject) {
					try {
						var decodedJWT = jwt.verify(token, 'qwerty098');
						var bytes = CryptoJS.AES.decrypt(decodedJWT.token, 'abc123!@#!');
						var tokenData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
						
						user.findById(tokenData.id).then(function(user) {
							if (user) {
								resolve(user);
							} else {
								reject();
							}
						}, function(e) {
							reject();
						})
					} catch (e) {
						reject();
					}
				})
			}
		},
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'username', 'email', 'firstname', 'lastname', 'createdAt', 'updatedAt');
			},
			generateToken: function(type) {
				if (!_.isString(type)) {
					return undefined;
				}
				
				try {
					var stringData = JSON.stringify({id: this.get('id'), type: type});
					var encryptedData = CryptoJS.AES.encrypt(stringData, 'abc123!@#!').toString();
					var token = jwt.sign({
						token: encryptedData
					}, 'qwerty098');
					
					return token;
				} catch (e) {
					return undefined;
				}
			}
		}
	})
	return user;
};