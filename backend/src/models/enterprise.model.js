const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  const Entreprise = sequelize.define(
    "Entreprise",
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "XAF",
      },

      description: DataTypes.TEXT,
      logo_url: DataTypes.STRING,
      numero_fiscal: DataTypes.STRING,
      nui: DataTypes.STRING,
      adresse: DataTypes.STRING(500),
      ville: DataTypes.STRING(100),
      code_postal: DataTypes.STRING(20),
      email_contact: DataTypes.STRING(255),
      telephone_contact: DataTypes.STRING(50),
      informations_bancaires: DataTypes.STRING(255),
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );
  return Entreprise;
};
