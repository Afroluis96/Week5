/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('log', {
		logId: {
			type: DataTypes.INTEGER(11).UNSIGNED,
			allowNull: true,
			primaryKey: true
		},
		quantity: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '1'
		},
		logDate: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		userId: {
			type: DataTypes.INTEGER(11).UNSIGNED,
			allowNull: true,
			references: {
				model: 'users',
				key: 'userid'
			}
		},
		productId: {
			type: DataTypes.INTEGER(11).UNSIGNED,
			allowNull: true,
			references: {
				model: 'products',
				key: 'productid'
			}
		}
	}, {
		tableName: 'log',
		timestamps: false
	});
};
