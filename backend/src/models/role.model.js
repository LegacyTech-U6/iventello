const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define('Role', {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: DataTypes.TEXT,
  },{
    tableName: 'Role',   // 👈 Forcer la majuscule dans la BDD
    freezeTableName: true,   // 👈 Empêche Sequelize de changer le nom automatiquement
    timestamps: true,        // 👈 Active createdAt / updatedAt
  });
  return Role;
};
