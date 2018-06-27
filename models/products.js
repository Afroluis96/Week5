/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('products', {
		productId: {
			type: DataTypes.INTEGER(11).UNSIGNED,
			allowNull: true,
			primaryKey: true
		},
		productName: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		price: {
			type: "DOUBLE",
			allowNull: true,
			defaultValue: '0'
		},
		likes: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '0'
		},
		stock: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '0'
		},
		enable: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '0'
		}
	}, {
		tableName: 'products',
		timestamps: false
	});
};
