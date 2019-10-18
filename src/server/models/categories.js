/* jshint indent: 1 */

module.exports = (sequelize, DataTypes) => {
	const Category = sequelize.define('categories', {
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
    tableName: 'categories',
    timestamps: false
  });
  
  return Category; 
};
