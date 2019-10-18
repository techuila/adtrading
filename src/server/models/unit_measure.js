/* jshint indent: 1 */

module.exports = (sequelize, DataTypes) => {
	const UnitMeasure = sequelize.define('unit_measure', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: true,
      primaryKey: true,
      autoIncrement: true      
		},
		descr: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	}, {
    tableName: 'unit_measure',
    timestamps: false
  });

  UnitMeasure.associate = models => {
    UnitMeasure.Items = UnitMeasure.hasMany(models.ItemList, {
      as: 'Items',
      foreignKey: 'um_id'
    })
  }
  
  return UnitMeasure;
};
