// backend/app.js (ajouter à la config existante)
// Intégration des routes de synchronisation

const express = require('express');
const app = express();

// ...existing imports...

// Importer les routes de sync
const syncRoutes = require('./src/routes/sync.routes');

// ...existing middleware...

// Enregistrer les routes de synchronisation
app.use('/api/sync', syncRoutes);

// ...rest of existing config...

module.exports = app;
