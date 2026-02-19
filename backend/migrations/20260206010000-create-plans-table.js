"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Plans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      billing_cycle: {
        type: Sequelize.ENUM("month", "year"),
        allowNull: false,
        defaultValue: "month",
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "EUR",
      },
      max_companies: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      max_users: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      max_products: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 100,
      },
      max_admins: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      max_workers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      features: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      payment_reference: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Identifier at the payment provider (e.g., Stripe Price ID)",
      },
      payment_provider: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "manual",
        comment: "stripe | momo | paypal | manual",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Plans");
  },
};
