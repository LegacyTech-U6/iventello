const cron = require("node-cron");
const db = require("../config/db.js");
const { getDailySalesReport } = require("../controller/SalesReport.controller.js");
const { generateDailyPurchaseReport } = require("../controller/purchaseReport.controller.js");

// Exécute chaque jour à 23h59
cron.schedule("59 23 * * *", async () => {
  console.log("🕐 Génération automatique des rapports journaliers...");

  try {
    const entreprises = await db.Entreprise.findAll();

    for (const ent of entreprises) {
      // --- Rapport des ventes ---
      try {
        const reqSales = { entrepriseId: ent.id };
        const resSales = { status: () => ({ json: () => {} }) }; // pas besoin d'afficher
        await getDailySalesReport(reqSales, resSales);
        console.log(`✅ Rapport ventes généré pour ${ent.name}`);
      } catch (err) {
        console.error(`❌ Erreur rapport ventes pour ${ent.name}:`, err);
      }

      // --- Rapport des achats ---
      try {
        await generateDailyPurchaseReport(ent.id);
        console.log(`✅ Rapport achats généré pour ${ent.name}`);
      } catch (err) {
        console.error(`❌ Erreur rapport achats pour ${ent.name}:`, err);
      }
    }

    console.log("✅ Tous les rapports journaliers ont été générés !");
  } catch (err) {
    console.error("❌ Erreur génération rapports journaliers:", err);
  }
});
