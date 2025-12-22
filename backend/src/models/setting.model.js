// models/Setting.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Setting = sequelize.define('Setting', {
    stock_alert_threshold: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
  },{
    tableName: 'Setting',   // 👈 Forcer la majuscule dans la BDD
    freezeTableName: true,   // 👈 Empêche Sequelize de changer le nom automatiquement
    timestamps: true,        // 👈 Active createdAt / updatedAt
  });

  

  return Setting;
};
