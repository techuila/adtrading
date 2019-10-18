/* jshint indent: 1 */

module.exports = (sequelize, DataTypes) => {
	const SupCust = sequelize.define('sup_cust', {
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
		type: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		company: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	}, {
    tableName: 'sup_cust',
    timestamps: false
  });

  SupCust.associate = models => {
  }
  
  return SupCust;
};
