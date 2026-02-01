const express = require("express");
const router = express.Router();

const ExpenseController = require("../controller/expense.controller");
const getActiveEntreprise = require("../middleware/activeEntreprise");
const authenticateUser = require("../middleware/AuthenticatedUser");

// Middleware to get active enterprise
router.use(getActiveEntreprise);

// Routes
router.post("/", authenticateUser, ExpenseController.createExpense);
router.get("/", ExpenseController.getExpenses);
router.put("/:id", authenticateUser, ExpenseController.updateExpense);
router.delete("/:id", authenticateUser, ExpenseController.deleteExpense);

module.exports = router;
