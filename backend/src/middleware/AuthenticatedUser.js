// middleware/authenticateUser.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // pour charger JWT_SECRET depuis .env si utilisé

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key'; // fallback pour dev

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Vérifie que le header existe et qu'il commence par "Bearer"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou invalide' });
  }

  // Récupérer uniquement le token (après "Bearer ")
  const token = authHeader.split(' ')[1];
if (!token) {
  res.status(401).json({message:'No Token , authorization denied'})
  
}
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // contient { id, email, iat, exp }
    console.log('====================================');
    console.log("the decoded user is ", req.user);
    console.log('====================================');
    next(); // passe au prochain middleware ou route
  } catch (err) {
    return res.status(400).json({ message: 'invalide Token or expired' });
  }
};

module.exports = authenticateUser;
