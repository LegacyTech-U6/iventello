const db = require('../config/db');

async function logActivity({
  user, // objet User ou Worker
  action,
  entity_type,
  entity_id = null,
  description = null,
  quantity = null,
  amount = null,
  ip_address = null,
  user_agent = null,
  entreprise_id = null
}) {
  try {
    console.log("📝 logActivity appelé avec :", { user, action, entity_type, entity_id });

    const data = {
      action,
      entity_type,
      entity_id,
      description,
      quantity,
      amount,
      ip_address,
      user_agent,
      entreprise_id
    };

    // Vérifie le type d'utilisateur
    if (user.type === 'worker') {
      data.worker_id = user.id;
      console.log(`👷 Worker détecté, worker_id: ${user.id}`);
    } else if (user.type === 'admin') {
      data.user_id = user.id;
      console.log(`🛡️ Admin détecté, user_id: ${user.id}`);
    } else {
      console.warn('⚠️ Utilisateur inconnu pour logger l’activité');
      return;
    }

    console.log("💾 Données à insérer dans activities :", data);
    const activity = await db.activities.create(data);
    console.log("✅ Activité loggée avec succès :", activity.toJSON());
  } catch (err) {
    console.error('🔥 Erreur lors de l’activité:', err);
  }
}

module.exports = logActivity;
