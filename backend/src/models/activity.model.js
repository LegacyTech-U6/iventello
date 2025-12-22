// models/Activity.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Activity = sequelize.define('Activity', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    action: {
      type: DataTypes.STRING, // Exemple: "Achat", "Vente", "Ajout stock"
      allowNull: false,
    },
    entity_type: {
      type: DataTypes.STRING, // "Product", "Category", "Order", etc.
      allowNull: false,
    },
    entity_id: {
      type: DataTypes.INTEGER, // ID de l’objet affecté
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT, // Texte libre décrivant l’action
      allowNull: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    quantity:{
      type:DataTypes.INTEGER,
      allowNull:true
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  })

  

  return Activity;
};
