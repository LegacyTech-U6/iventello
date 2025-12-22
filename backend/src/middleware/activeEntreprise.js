// middleware/activeEntreprise.js
const getActiveEntreprise = (req, res, next) => {
  // Lire le header X-Entreprise-Id
  const entrepriseId = req.headers['x-entreprise-id'];

  console.log('🏢 X-Entreprise-Id reçu :', entrepriseId);

  if (!entrepriseId) {
    console.log('⚠️ Aucun X-Entreprise-Id trouvé dans les headers');
    req.entrepriseId = null;
  } else {
    // On stocke directement l'UUID tel quel
    req.entrepriseId = entrepriseId;
    console.log('✅ Entreprise UUID stocké dans req.entrepriseId :', req.entrepriseId);
  }

  next();
};

module.exports = getActiveEntreprise;
