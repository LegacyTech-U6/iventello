const { Op } = require("sequelize");
const db = require("../config/db");
const User = db.User;

async function cleanupInactiveUsers() {
  console.log("🧹 Starting cleanup of inactive users...");

  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

  const inactiveUsers = await User.findAll({
    where: {
      is_active: false,
      created_at: { [Op.lt]: twoHoursAgo },
    },
  });

  console.log(`🔍 Found ${inactiveUsers.length} inactive users older than 2h.`);

  if (inactiveUsers.length === 0) {
    console.log("✅ No users to delete.");
    return;
  }

  await User.sequelize.transaction(async (t) => {
    const count = await User.destroy({
      where: {
        is_active: false,
        created_at: { [Op.lt]: twoHoursAgo },
      },
      transaction: t,
    });
    console.log(`🗑️ Deleted ${count} inactive users.`);
  });

  console.log("✅ Cleanup complete.");
}

module.exports = cleanupInactiveUsers;
