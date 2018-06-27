/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('likes', {
		likeId: {
			type: DataTypes.INTEGER(11).UNSIGNED,
			allowNull: true,
			primaryKey: true
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
		tableName: 'likes',
		timestamps: false
	});
};
