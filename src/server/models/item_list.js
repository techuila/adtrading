/* jshint indent: 1 */

module.exports = (sequelize, DataTypes) => {
	const ItemList = sequelize.define('item_list', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: true,
      primaryKey: true,
      autoIncrement: true      
		},
		itemCode: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		productCode: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		descr: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		qtyIn: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		qtyOut: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		um_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		unit_price: {
			type: DataTypes.REAL,
			allowNull: true
		},
		criticalLevel: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		vatAmt: {
			type: DataTypes.REAL,
			allowNull: true
		},
		categoryID: {
			type: DataTypes.INTEGER,
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
		tableName: 'item_list'
  });
  
  ItemList.associate = models => {
    ItemList.Creator = ItemList.belongsTo(models.User, {
      as: 'Creator',
      foreignKey: 'user_id'
    })

    ItemList.Category = ItemList.belongsTo(models.Category, {
      as: 'Category',
      foreignKey: 'categoryID'
    })

    ItemList.UnitMeasure = ItemList.belongsTo(models.UnitMeasure, {
      as: 'UnitMeasure',
      foreignKey: 'um_id'
    })
  }

  return ItemList;
};
