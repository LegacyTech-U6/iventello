// middlewares/validateProduct.js
const { body, validationResult } = require('express-validator');

const validateProduct = [
 
  body('Prod_name')
    .notEmpty().withMessage('Le nom du produit est obligatoire')
    .isLength({ min: 3 }).withMessage('Le nom du produit doit avoir au moins 3 caractères'),

  body('quantity')
    .optional() // peut être NULL
    .isInt({ min: 0 }).withMessage('La quantité doit être un entier positif ou zéro'),

  body('cost_price')
    .notEmpty().withMessage('Le prix de revient est obligatoire')
    .isFloat({ gt: 0 }).withMessage('Le prix de revient doit être positif'),

  body('selling_price')
    .notEmpty().withMessage('Le prix de vente est obligatoire')
    .isFloat({ gt: 0 }).withMessage('Le prix de vente doit être positif'),

  body('category_id')
    .optional()
    .isInt({ min: 1 }).withMessage('L’ID de catégorie doit être un entier positif'),

  body('Prod_Description')
    .optional()
    .isLength({ max: 1000 }).withMessage('La description ne doit pas dépasser 1000 caractères'),

  body('code_bar')
    .optional()
    .isLength({ min: 5, max: 255 }).withMessage('Le code-barres doit contenir entre 5 et 255 caractères'),

  body('date_of_arrival')
    .optional()
    .isISO8601().withMessage('La date d’arrivée doit être au format YYYY-MM-DD'),


  body('Prod_image')
    .optional()
    .isLength({ max: 255 }).withMessage('L’URL de l’image ne doit pas dépasser 255 caractères'),

  // Middleware final pour gérer les erreurs
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateProduct;
