"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {
      // Define association here
      Subscription.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      Subscription.belongsTo(models.Plan, {
        foreignKey: "plan_id",
        as: "plan",
      });
    }
  }

  Subscription.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      plan_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
      },
      current_period_start: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      current_period_end: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Subscription",
    },
  );

  return Subscription;
};
