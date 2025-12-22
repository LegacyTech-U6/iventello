
module.exports = (sequelize, DataTypes) => {
    const DailyPurchaseReport = sequelize.define(
        "DailyPurchaseReport", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            total_purchases: {
                type: DataTypes.DECIMAL(12, 2),
                defaultValue: 0
            },
            total_items_purchased: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            transactions: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            average_purchase: {
                type: DataTypes.DECIMAL(12, 2),
                defaultValue: 0
            },
            top_products: {
                type: DataTypes.JSON,
                defaultValue: []
            },
            purchases_by_supplier: {
                type: DataTypes.JSON,
                defaultValue: []
            },
            details: {
                type: DataTypes.JSON,
                defaultValue: []
            },
            entreprise_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        },
    {
    tableName: 'DailyPurchaseReport',   // 👈 Forcer la majuscule dans la BDD
    freezeTableName: true,   // 👈 Empêche Sequelize de changer le nom automatiquement
    timestamps: true,        // 👈 Active createdAt / updatedAt
  });
    return DailyPurchaseReport;
};