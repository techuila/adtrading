/* jshint indent: 1 */

module.exports = (sequelize, DataTypes) => {
	const Order = sequelize.define('orders', {
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
		itemID: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		qty: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		itemCost: {
			type: DataTypes.REAL,
			allowNull: true
		},
		discount: {
			type: DataTypes.REAL,
			allowNull: true
		},
		totalAmount: {
			type: DataTypes.REAL,
			allowNull: true
		}
	}, {
    tableName: 'orders',
    timestamps: false
  });
  
  Order.associate = models => {
    Order.Item = Order.belongsTo(models.ItemList, {
      as: 'Items',
      foreignKey: 'itemID'
    })

    Order.Transaction = Order.belongsTo(models.Transaction, {
      as: 'Transaction',
      foreignKey: 'transaction_id'
    })
  }

  return Order;
};
