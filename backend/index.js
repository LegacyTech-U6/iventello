const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const db = require("./src/config/db");
// 🕐 Charger le cron des rapports journaliers
require("./src/crons/dailyReports");
const cron = require("node-cron");
dotenv.config();
const { testMailjetConnection } = require("./src/config/mail.config");
const createAllUsersView = require("./src/config/createAllUsersView");
const purchaseRoutes = require("./src/routes/purchase.route");
const ProductRoute = require("./src/routes/product.route");
const ProductRouteStats = require("./src/routes/stats");
const CategoryRoute = require("./src/routes/category.route");
const SupplierRoute = require("./src/routes/supplier.route");
const OrderRoute = require("./src/routes/order.route");
const factureRoutes = require("./src/routes/facture.route");
const clientRoute = require("./src/routes/client.route");
const user = require("./src/routes/Auths.route");
const entreprise = require("./src/routes/entreprise.routes");
const workers = require("./src/routes/workers.routes");
const rolesRoutes = require("./src/routes/roles.routes");
const activityRoutes = require("./src/routes/activity.routes");
const cleanupInactiveUsers = require("./src/utils/cleanupInactiveUsers");
const notificationRoutes = require("./src/routes/notification.routes");
const pdfRoute = require("./src/routes/pdf.routes");
const DemoDataGenerator = require("./src/utils/demo-data-generator");
const productExcelRoutes = require("./src/routes/excel/productExcel.routes");

const { startCurrencyCron, getRates } = require("./src/utils/currency.service");
// Database
// ton index.js Sequelize

cron.schedule("0 */2 * * *", async () => {
  try {
    console.log("⏰ Running scheduled cleanup of inactive users...");
    await cleanupInactiveUsers();

    console.log("✅ Cleanup completed successfully!");
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
  }
});

app.get("/convert", async (req, res) => {
  try {
    const converted = await getRates();
    res.json({ converted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Rôles prédéfinis
const predefinedRoles = [
  {
    name: "Admin",
    description: "Full access to all system features and settings",
  },
  {
    name: "StockManager",
    description: "Manages stock, products, and inventory",
  },
  { name: "SalesPoint", description: "Handles sales at points of sale" },
];
const Role = db.roles;
async function seedPredefinedRoles() {
  const countRoles = await Role.count();
  console.log("Nombre de rôles existants :", countRoles);
  if (countRoles === 0) {
    for (const role of predefinedRoles) {
      await Role.create(role);
      console.log(`Role "${role.name}" créé ✅`);
    }
  } else {
    console.log("Les rôles existent déjà, seed ignoré.");
  }
}
const threst_hold = [{}];
const env = process.env.NODE_ENV || "production";
async function startApp() {
  if (process.env.NODE_ENV === "development") {
    console.log("🟢 Sync DEV activé");

    await db.sequelize.sync();
  } else {
    console.log("🚫 Sync désactivé en production");
  }

  // Ici tu peux utiliser await
  await startCurrencyCron();
  await seedPredefinedRoles();
  await createAllUsersView();
}

startApp();

app.use(express.json());
app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);
  next();
});
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .filter(Boolean);
if (allowedOrigins.length === 0) {
  allowedOrigins.push("https://iventello.vercel.app", "http://localhost:5173");
} else {
  // Always include localhost for development if not present
  if (!allowedOrigins.includes("http://localhost:5173")) {
    allowedOrigins.push("http://localhost:5173");
  }
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Autorise Postman / requêtes sans origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use("/api/activities", activityRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/purchase", purchaseRoutes);
app.use("/api/products", ProductRoute);
app.use("/api/category", CategoryRoute);
app.use("/api/stats", ProductRouteStats);
app.use("/api/suppliers", SupplierRoute);
app.use("/api/orders", OrderRoute);
app.use("/api/factures", factureRoutes);
app.use("/api/client", clientRoute);
app.use("/api/auth", user);
app.use("/api/entreprises", entreprise);
app.use("/api/workers", workers);
app.use("/api/roles", rolesRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/pdf", pdfRoute);
app.use("/api/excel", productExcelRoutes);

module.exports = app;
