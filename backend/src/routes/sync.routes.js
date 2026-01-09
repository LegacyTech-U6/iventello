// backend/routes/sync.routes.js
// Routes de synchronisation offline-first
// Pour fonctionner avec le PWA Stockly

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticateToken = require('../middleware/AuthenticatedUser');

// Liste des tables synchronisables
const SYNC_TABLES = [
  'Product', 'Entreprise', 'User', 'Activity', 'Notification', 'Category', 'Client',
  'CurrencyRate', 'DailyPurchaseReport', 'Invoice', 'FactureItem', 'Order',
  'Purchase', 'PurchaseItem', 'Role', 'Sales', 'DailySalesReport', 'Setting',
  'Supplier', 'Worker'
];

// ============ GET /api/sync/:table ============
// Récupère les données pour le PWA (pull depuis serveur)

router.get('/:table', authenticateToken, async (req, res) => {
  try {
    const { table } = req.params;
    const entrepriseId = req.user?.entrepriseId;

    // Valider le nom de table
    if (!SYNC_TABLES.includes(table)) {
      return res.status(400).json({ success: false, message: 'Table invalide' });
    }

    // Récupérer le modèle
    const Model = db[table];
    if (!Model) {
      return res.status(400).json({ success: false, message: `Modèle ${table} non trouvé` });
    }

    // Construire la requête avec filtre entreprise si applicable
    const options = {};
    const tablesWithEnterprise = ['Product', 'DailyPurchaseReport', 'DailySalesReport', 'Client'];
    if (tablesWithEnterprise.includes(table) && entrepriseId) {
      options.where = { entreprise_id: enterpriseId };
    }

    // Récupérer les données
    const data = await Model.findAll(options);

    // Convertir en JSON simple (compatible SQLite)
    const jsonData = data.map(item => item.toJSON());

    res.json(jsonData);
  } catch (error) {
    console.error(`[SYNC] Erreur GET ${req.params.table}:`, error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ POST /api/sync/:table ============
// Applique les changements locaux au serveur (push)

router.post('/:table', authenticateToken, async (req, res) => {
  try {
    const { table } = req.params;
    const { operation, recordId, data } = req.body;
    const entrepriseId = req.user?.entrepriseId;

    // Validation
    if (!SYNC_TABLES.includes(table)) {
      return res.status(400).json({ success: false, message: 'Table invalide' });
    }

    if (!['insert', 'update', 'delete'].includes(operation)) {
      return res.status(400).json({ success: false, message: 'Opération invalide' });
    }

    const Model = db[table];
    if (!Model) {
      return res.status(400).json({ success: false, message: `Modèle ${table} non trouvé` });
    }

    // Appliquer l'opération
    switch (operation) {
      case 'insert':
        // Ajouter l'entreprise ID si nécessaire
        const tablesWithEnterprise = ['Product', 'DailyPurchaseReport', 'DailySalesReport', 'Client'];
        if (tablesWithEnterprise.includes(table) && enterpriseId) {
          data.entreprise_id = enterpriseId;
        }

        const created = await Model.create(data);
        res.status(201).json({ success: true, id: created.id, data: created.toJSON() });
        break;

      case 'update':
        // Vérifier la permission et appliquer
        if (recordId) {
          await Model.update(data, { where: { id: recordId } });
          const updated = await Model.findByPk(recordId);
          res.json({ success: true, data: updated?.toJSON() });
        } else {
          res.status(400).json({ success: false, message: 'recordId requis pour update' });
        }
        break;

      case 'delete':
        if (recordId) {
          await Model.destroy({ where: { id: recordId } });
          res.json({ success: true, message: 'Supprimé' });
        } else {
          res.status(400).json({ success: false, message: 'recordId requis pour delete' });
        }
        break;
    }
  } catch (error) {
    console.error(`[SYNC] Erreur POST ${req.params.table}:`, error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ POST /api/sync/batch ============
// Applique plusieurs changements en une seule requête (optimisé)

router.post('/batch', authenticateToken, async (req, res) => {
  try {
    const { changes } = req.body; // Array of { table, operation, recordId, data }

    if (!Array.isArray(changes)) {
      return res.status(400).json({ success: false, message: 'changes doit être un array' });
    }

    const results = [];

    for (const change of changes) {
      const { table, operation, recordId, data } = change;

      try {
        if (!SYNC_TABLES.includes(table)) {
          results.push({ table, success: false, error: 'Table invalide' });
          continue;
        }

        const Model = db[table];
        if (!Model) {
          results.push({ table, success: false, error: 'Modèle non trouvé' });
          continue;
        }

        switch (operation) {
          case 'insert':
            const created = await Model.create(data);
            results.push({ table, operation, success: true, id: created.id });
            break;
          case 'update':
            await Model.update(data, { where: { id: recordId } });
            results.push({ table, operation, success: true });
            break;
          case 'delete':
            await Model.destroy({ where: { id: recordId } });
            results.push({ table, operation, success: true });
            break;
        }
      } catch (error) {
        results.push({ table, operation, success: false, error: error.message });
      }
    }

    res.json({ success: true, results });
  } catch (error) {
    console.error('[SYNC] Erreur batch:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ GET /api/sync/status ============
// Vérifier l'état du serveur (health check)

router.get('/status', (req, res) => {
  res.json({
    success: true,
    message: 'Serveur Iventello en ligne',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router;
