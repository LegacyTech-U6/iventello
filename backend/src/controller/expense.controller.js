const db = require("../config/db");
const Expense = db.Expense;
const sequelizeQuery = require("sequelize-query");
const queryParser = sequelizeQuery(db);

exports.createExpense = async (req, res) => {
  try {
    const { title, amount, date, category, description } = req.body;
    const entreprise_id = req.entrepriseId || null;
    const user_id = req.user?.id;

    const expense = await Expense.create({
      title,
      amount,
      date,
      category,
      description,
      entreprise_id,
      user_id,
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const query = await queryParser.parse(req);
    const entreprise_id = req.entrepriseId || null;
    query.where = { ...query.where, entreprise_id };

    const expenses = await Expense.findAll({
      ...query,
      order: [["date", "DESC"]],
    });

    const count = await Expense.count({ where: query.where });

    res.status(200).json({ count, data: expenses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const entreprise_id = req.entrepriseId || null;

    const expense = await Expense.findOne({
      where: { id, entreprise_id },
    });

    if (!expense) {
      return res.status(404).json({ message: "Dépense non trouvée" });
    }

    await expense.destroy();
    res.status(200).json({ message: "Dépense supprimée" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const entreprise_id = req.entrepriseId || null;

    const expense = await Expense.findOne({
      where: { id, entreprise_id },
    });

    if (!expense) {
      return res.status(404).json({ message: "Dépense non trouvée" });
    }

    await expense.update(req.body);
    res.status(200).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
