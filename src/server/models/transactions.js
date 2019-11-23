/* jshint indent: 1 */

module.exports = (sequelize, DataTypes) => {
	const Transaction = sequelize.define('transactions', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: true,
      primaryKey: true,
      autoIncrement: true
		},
		receiptNumber: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		supCustID: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		userID: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		type: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		remarks: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		due_date: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: new Date(),
      allowNull: false
		},
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: new Date(),
      allowNull: false
		}
	}, {
		tableName: 'transactions'
  });
  
  Transaction.associate = models => {
    Transaction.Order = Transaction.hasMany(models.Order, {
      as: 'Orders',
      foreignKey: 'transaction_id',
      onDelete: 'CASCADE', 
      hooks: true
    })

    Transaction.Payment = Transaction.hasMany(models.Payment, {
      as: 'Payments',
      foreignKey: 'transaction_id',
      onDelete: 'CASCADE', 
      hooks: true
    })

    Transaction.SupCust = Transaction.belongsTo(models.SupCust, {
      as: 'SupCust',
      foreginKey: 'supCustID'
    })

    Transaction.User = Transaction.belongsTo(models.User, {
      as: 'User',
      foreginKey: 'userID'
    })
  }

  return Transaction;
};
