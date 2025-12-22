const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PurchaseItem = sequelize.define('PurchaseItem', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit_cost: {
      type: DataTypes.DECIMAL(10, 3), // ✅ pour 2 chiffres après la virgule
      allowNull: false,
    },
    tva: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_item: {
      type: DataTypes.VIRTUAL,
      get() {
        const q = this.getDataValue('quantity') || 0;
        const u = this.getDataValue('unit_cost') || 0;
        const t = this.getDataValue('tva') || 0;
        const d = this.getDataValue('discount') || 0;
        return (q * u * (1 + t / 100)) - d;
      },
    },
  },{
    tableName: 'PurchaseItem',   // 👈 Forcer la majuscule dans la BDD
    freezeTableName: true,   // 👈 Empêche Sequelize de changer le nom automatiquement
    timestamps: true,        // 👈 Active createdAt / updatedAt
  });

  return PurchaseItem;
};
