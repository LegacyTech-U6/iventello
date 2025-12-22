const {body,validationResult} = require('express-validator');

const validateSupplier = [
  body('supplier_name')
    .notEmpty().withMessage('Le nom du fournisseur est obligatoire')
    .isLength({ min: 3 }).withMessage('Le nom du fournisseur doit avoir au moins 3 caractères'),
    body('supplier_address')
    .optional()
    .isLength({ max: 255 }).withMessage('L’adresse du fournisseur ne doit pas dépasser 255 caractères'),
    body('phone_number')
    .notEmpty().withMessage('Le numéro de téléphone est obligatoire')
    .isMobilePhone('any').withMessage('Le numéro de téléphone doit être valide'),
    // Middleware final pour gérer les erreurs
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
];

module.exports = validateSupplier;