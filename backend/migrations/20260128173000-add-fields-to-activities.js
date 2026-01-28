"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Ajouter la colonne entreprise_id si elle n'existe pas
    // Note: En mode sync() elle peut déjà être là, mais la migration assure la prod
    try {
      await queryInterface.addColumn("Activities", "entreprise_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    } catch (e) {
      console.log("Column entreprise_id might already exist");
    }

    // 2. Ajouter la colonne worker_id
    try {
      await queryInterface.addColumn("Activities", "worker_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    } catch (e) {
      console.log("Column worker_id might already exist");
    }

    // 3. Mettre à jour les enregistrements existants
    // On met entreprise_id = 1 et worker_id = 1 par défaut pour les anciens logs
    return queryInterface.sequelize.query(
      'UPDATE "Activities" SET entreprise_id = 1, worker_id = 1 WHERE entreprise_id IS NULL OR worker_id IS NULL',
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Activities", "entreprise_id");
    await queryInterface.removeColumn("Activities", "worker_id");
  },
};
