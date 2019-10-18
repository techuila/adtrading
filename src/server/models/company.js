/* jshint indent: 1 */

module.exports = (sequelize, DataTypes) => {
	const Company = sequelize.define('company', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true
		},
		descr: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	}, {
    tableName: 'company',
    timestamps: false
  });
  
  // Company.associate = models => {
  //   Company.hasMany(models.SupCust, {
  //     as: 'SupCust',
  //     foreignKey: 'companyID'
  //   })
  // }

  return Company;
};
