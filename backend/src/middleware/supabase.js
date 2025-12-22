const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// ⚡ Connexion Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY// clé Service Role pour upload côté serveur
);

// Debug: Vérifier la connexion
console.log("✅ Supabase connected:", {
    url: process.env.SUPABASE_URL ? "configured" : "missing",
    key: process.env.SUPABASE_KEY ? "configured" : "missing"
});

module.exports = {supabase};
