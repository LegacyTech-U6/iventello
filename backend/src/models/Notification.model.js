// models/Notification.js
const  { DataTypes }  =  require('sequelize')


module.exports = (sequelize)=>{ 
const Notification = sequelize.define('Notification', {
  type: {
    type: DataTypes.STRING,
    allowNull: false, // 'sale', 'purchase', etc.
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
},{
    tableName: 'Notification',   // 👈 Forcer la majuscule dans la BDD
    freezeTableName: true,   // 👈 Empêche Sequelize de changer le nom automatiquement
    timestamps: true,        // 👈 Active createdAt / updatedAt
  });

return Notification;
}
