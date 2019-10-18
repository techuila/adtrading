/* jshint indent: 1 */
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('users', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: true,
      primaryKey: true,
      autoIncrement: true      
		},
		firstName: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		lastName: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		username: {
			type: DataTypes.TEXT,
      allowNull: true,
      unique: {
        args: true,
        msg: 'Username already exists!'
      }
		},
		email: {
			type: DataTypes.TEXT,
      allowNull: true,
      unique: {
        args: true,
        msg: 'Email already exists!'
      }
		},
		password: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		userType: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		last_login: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		date: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		createdAt: {
			type: 'TIMESTAMP',
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
		},
		updatedAt: {
			type: 'TIMESTAMP',
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
		}
	}, {
    tableName: 'users',
    hooks: {
      beforeUpdate: (user, options) => {
        options.validate = false
      },
      afterValidate: (user) => {
        console.log(user.password)
        if(user.password)
          user.password = bcrypt.hashSync(user.password, 8)
      },
    }
  });

  User.associate = models => {
    User.hasMany(models.Log, {
      as: 'Logs',
      foreignKey: 'userID'
    })
  }
  
  return User;
};
