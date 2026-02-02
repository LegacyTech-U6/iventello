"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the column already exists (optional safety) before adding
    const tableInfo = await queryInterface.describeTable("Invoice");

    if (!tableInfo.payment_method) {
      await queryInterface.addColumn("Invoice", "payment_method", {
        type: Sequelize.STRING,
        defaultValue: "espece",
        allowNull: true,
      });
    }

    if (!tableInfo.date_echeance) {
      await queryInterface.addColumn("Invoice", "date_echeance", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // If you ever revert, remove the column
    await queryInterface.removeColumn("Invoice", "payment_method");
    await queryInterface.removeColumn("Invoice", "date_echeance");
  },
};
