// models/CurrencyRate.model.js (CommonJS)
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
// Définition du modèle CurrencyRate
// Utilisation de DataTypes pour définir les types de données
// base: Devise de base (ex: 'USD')
// rates: JSON contenant les taux de change pour d'autres devises
// updatedAt: Date de la dernière mise à jour des taux
const CurrencyRate = sequelize.define('CurrencyRate', {
    base: {
        type: DataTypes.STRING(5),
        primaryKey: true,
    },
    rates: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'currency_rates',
    timestamps: false,
})
 return CurrencyRate;
}
