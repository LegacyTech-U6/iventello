const db = require("../config/db"); 

exports.createPurchase = async (req, res) => {
  try {
    const { supplier_name, items, payment_method } = req.body;

    // Calcul du total
    const total = items.reduce((sum, item) => sum + item.quantity * item.unit_cost, 0);

    const purchase = await db.Purchase.create({
      entreprise_id: req.user.entrepriseId,
      supplier_name,
      payment_method,
      total_amount: total,
      items: items
    }, {
      include: [{ model: db.PurchaseItem, as: 'items' }]
    });

    // Mise à jour du stock produit
    for (const item of items) {
      const product = await db.Product.findByPk(item.product_id);
      if (product) {
        await product.increment('quantity', { by: item.quantity });
      }
    }

    res.status(201).json({ message: "Achat enregistré avec succès", purchase });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l’enregistrement de l’achat" });
  }
};
