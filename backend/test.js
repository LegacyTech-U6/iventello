const db = require("./src/config/db");

async function createUser() {
  try {
    // Connexion à la DB
    await db.sequelize.authenticate();
    console.log("✅ Connexion DB réussie");

    // Création de l'utilisateur
    const user = await db.User.create({
      username: "fillin",
      Last_name: "Sylla",
      email: "djeutchouruxel@gmail.com",
      telephone: "690000000",
      password_hash: "admin123", // sera hashé automatiquement
      is_active: true,
      onboarding_completed: true,
    });

    console.log("🎉 Utilisateur créé avec succès !");
    console.log({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'utilisateur");
    console.error(error.message);
  } finally {
    await db.sequelize.close();
    console.log("🔌 Connexion DB fermée");
  }
}

createUser();
