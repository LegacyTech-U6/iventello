const ExcelJS = require('exceljs');
const db = require("../../config/db");

const Product = db.Product;
const Category = db.Category;
const Supplier = db.Supplier;
const sequelize = db.sequelize;

exports.importProducts = async (fileBuffer, entreprise_id, user_id = null) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(fileBuffer);

  const sheet = workbook.getWorksheet('Produits');
  if (!sheet) throw new Error('Feuille "Produits" introuvable');

  const result = {
    inserted: 0,
    updated: 0,
    errors: [],
  };

  const transaction = await sequelize.transaction();

  try {
    console.log(`🔹 Import commencé pour entreprise_id=${entreprise_id}`);

    // Boucle synchrone pour await correct
    for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber++) {
      const row = sheet.getRow(rowNumber);

      const [
        prod_name,
        selling_price,
        cost_price,
        quantity,
        description,
        code_bar,
        date_of_arrival,
        min_stock_level,
        max_stock_level,
        category_name,
        supplier_name,
      ] = row.values.slice(1);

      console.log(`➡️ Ligne ${rowNumber}: ${prod_name}, catégorie: ${category_name}, fournisseur: ${supplier_name}`);

      try {
        if (!prod_name || selling_price < 0 || cost_price < 0) {
          throw new Error('Nom ou prix invalide');
        }

        let category = null;
        if (category_name) {
          category = await Category.findOne({
            where: { name: category_name, entreprise_id },
            transaction,
          });
          console.log(`    Category found: ${category?.name || 'None'}`);
        }

        let supplier = null;
        if (supplier_name) {
          supplier = await Supplier.findOne({
            where: { name: supplier_name, entreprise_id },
            transaction,
          });
          console.log(`    Supplier found: ${supplier?.supplier_name || 'None'}`);
        }

        let product = await Product.findOne({
          where: { Prod_name: prod_name, entreprise_id },
          transaction,
        });

        if (product) {
          await product.update({
            selling_price,
            cost_price,
            quantity: quantity || 0,
            Prod_Description: description,
            code_bar,
            date_of_arrival,
            min_stock_level: min_stock_level || 0,
            max_stock_level: max_stock_level || null,
            category_id: category?.id || null,
            supplier_id: supplier?.id || null,
            user_id,
          }, { transaction });
          result.updated += 1;
          console.log(`    Produit mis à jour ✅`);
        } else {
          await Product.create({
            Prod_name: prod_name,
            selling_price,
            cost_price,
            quantity: quantity || 0,
            Prod_Description: description,
            code_bar,
            date_of_arrival,
            min_stock_level: min_stock_level || 0,
            max_stock_level: max_stock_level || null,
            category_id: category?.id || null,
            supplier_id: supplier?.id || null,
            entreprise_id,
            user_id,
          }, { transaction });
          result.inserted += 1;
          console.log(`    Nouveau produit ajouté ✅`);
        }
      } catch (errRow) {
        console.error(`❌ Erreur ligne ${rowNumber}:`, errRow.message);
        result.errors.push({ row: rowNumber, error: errRow.message });
      }
    }

    await transaction.commit();
    console.log(`🔹 Import terminé: ${result.inserted} insérés, ${result.updated} mis à jour`);
  } catch (err) {
    await transaction.rollback();
    console.error('❌ Erreur transaction:', err);
    throw err;
  }

  return result;
};
