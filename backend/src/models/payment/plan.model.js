"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Plan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // definer les associations ici si necessaire
    }
  }

  Plan.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      billing_cycle: {
        type: DataTypes.ENUM("month", "year"),
        allowNull: false,
        defaultValue: "month",
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "EUR",
      },
      max_companies: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      max_users: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      max_products: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100,
      },
      max_admins: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      max_workers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      features: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      payment_reference: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      payment_provider: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "manual",
      },
    },
    {
      sequelize,
      modelName: "Plan",
    },
  );

  return Plan;
};
