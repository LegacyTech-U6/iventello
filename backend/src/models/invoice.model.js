const {DataTypes} = require('sequelize')

module.exports = (sequelize)=>{
    const Invoice = sequelize.define('Invoice',{
        date_echeance:{
            type:DataTypes.DATE,
            allowNull:true
        },
        status:{
            type:DataTypes.ENUM('en_attente','payee','annulee','non-livrer'),
            defaultValue:'en_attente'
        },
        payment_method:{
            type:DataTypes.STRING,
            defaultValue:'espece',
            allowNull:true

        },
        total:{
            type:DataTypes.FLOAT,
            allowNull:false
        },
        reduction_type:{
            type:DataTypes.STRING,
            defaultValue:'percentage'
        },
        discount:{
            type:DataTypes.FLOAT,
            allowNull:true,
            defaultValue:0
        },
        tax:{
            type:DataTypes.FLOAT,
            allowNull:true,
            defaultValue:0
        },
        general_total:{
             type:DataTypes.FLOAT,
            allowNull:false
        },
        notes:{
            type:DataTypes.TEXT
        }
    },

    {
    tableName: 'Invoice',   // 👈 Forcer la majuscule dans la BDD
    freezeTableName: true,   // 👈 Empêche Sequelize de changer le nom automatiquement
    timestamps: true,        // 👈 Active createdAt / updatedAt
  });

    return Invoice
};