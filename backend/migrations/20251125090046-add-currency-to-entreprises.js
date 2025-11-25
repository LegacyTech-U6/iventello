'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('Entreprises', 'currency', {
      type: Sequelize.STRING(10),
      allowNull: false,
      defaultValue: 'XAF',
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('Entreprises', 'currency');
  }
};
