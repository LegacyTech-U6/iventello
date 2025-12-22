// models/DailySalesReport.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const DailySalesReport = sequelize.define("DailySalesReport", {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: "entreprise_date_unique",
    },
    total_sales: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    total_items_sold: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    transactions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    average_sale: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    top_products: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    sales_by_category: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    entreprise_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "entreprise_date_unique",
    },
  },
  {
    tableName: 'DailySalesReport',   // 👈 Forcer la majuscule dans la BDD
    freezeTableName: true,   // 👈 Empêche Sequelize de changer le nom automatiquement
    timestamps: true,        // 👈 Active createdAt / updatedAt
  });

  return DailySalesReport;
};
