/* jshint indent: 1 */

module.exports = (sequelize, DataTypes) => {
	const Payment = sequelize.define('payments', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: true,
      primaryKey: true,
      autoIncrement: true      
		},
		transaction_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		customer_payment: {
			type: DataTypes.REAL,
			allowNull: true
		},
		amount_received: {
			type: DataTypes.REAL,
			allowNull: true 
		},
		customer_change: {
			type: DataTypes.REAL,
			allowNull: true
		},
		updatedAt: {
	  	type: DataTypes.DATE,
			defaultValue: new Date(),
      allowNull: false
		},
		createdAt: {
		  type: DataTypes.DATE,
			defaultValue: new Date(),
      allowNull: false
		}
	}, {
    tableName: 'payments',
    timestamps: false
  });
  
  Payment.associate = models => {
    Payment.belongsTo(models.Transaction, {
      as: 'Transaction',
      foreignKey: 'transaction_id'
    })
  }

  return Payment;
};
