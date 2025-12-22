const db = require('../config/db'); // ton instance Sequelize

async function createAllUsersView() {
  try {
    await db.sequelize.query(`
      CREATE OR REPLACE VIEW all_users AS
      SELECT id, email, password_hash, 'admin' AS type
      FROM "Users"
      UNION ALL
      SELECT id, email, password_hash, 'worker' AS type
      FROM "Worker";
    `);
    console.log("✅ Vue all_users créée ou mise à jour sans SECURITY DEFINER");
  } catch (err) {
    console.error("❌ Erreur création vue all_users:", err);
  }
}

module.exports = createAllUsersView;
