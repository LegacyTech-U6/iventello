const multer = require('multer');

// Stockage en mémoire (on ne garde pas le fichier physiquement)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      cb(null, true);
    } else {
      cb(new Error('Seulement les fichiers .xlsx sont acceptés'));
    }
  },
});

module.exports = upload;
