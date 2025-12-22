const multer = require("multer");

// 📌 Multer en mémoire pour Supabase
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Seuls les fichiers JPG, PNG et WEBP sont autorisés"));
  }
  cb(null, true);
};

const upload = multer({
  storage,                // fichiers gardés en mémoire
  fileFilter,             // filtre types autorisés
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
});

module.exports = upload;
