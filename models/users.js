/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('users', {
		userId: {
			type: DataTypes.INTEGER(11).UNSIGNED,
			allowNull: true,
			primaryKey: true
		},
		userName: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		userPassword: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		isAdmin: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '0'
		}
	}, {
		tableName: 'users',
		timestamps: false
	});
};
