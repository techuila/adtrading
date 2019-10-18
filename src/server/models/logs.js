/* jshint indent: 1 */

module.exports = (sequelize, DataTypes) => {
	const Log = sequelize.define('logs', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: true,
      primaryKey: true,
      autoIncrement: true      
		},
		userID: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		type: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		descr: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		createdAt: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		updatedAt: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	}, {
    tableName: 'logs',
    timestamps: false
  });
  
  Log.associate = models => {
    Log.belongsTo(models.User, {
      as: 'User',
      foreignKey: 'userID'
    })
  }

  return Log;
};
