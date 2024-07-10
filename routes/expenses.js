const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Mock data for expenses
let expenses = [
  { id: 1, category: 'Groceries', description: 'Milk, Eggs, Bread', amount: 20.00, date: '2023-06-15' },
  { id: 2, category: 'Entertainment', description: 'Movie ticket', amount: 12.50, date: '2022-06-18' }
];

// Retrieve all expenses
router.get('/', (req, res) => {
  res.json(expenses);
});

// Add a new expense
router.post('/', [
  check('category').isString().notEmpty(),
  check('description').isString().optional(),
  check('amount').isFloat({ gt: 0 }),
  check('date').isISO8601().toDate()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { category, description, amount, date } = req.body;
  const newExpense = {
    id: expenses.length + 1,
    category,
    description,
    amount,
    date
  };
  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

// Update an existing expense
router.put('/:id', [
  check('category').isString().optional(),
  check('description').isString().optional(),
  check('amount').isFloat({ gt: 0 }).optional(),
  check('date').isISO8601().toDate().optional()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const expense = expenses.find(exp => exp.id === parseInt(id));
  if (!expense) {
    return res.status(404).send('Expense not found');
  }

  const { category, description, amount, date } = req.body;
  if (category) expense.category = category;
  if (description) expense.description = description;
  if (amount) expense.amount = amount;
  if (date) expense.date = date;

  res.json(expense);
});

// Delete an existing expense
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  expenses = expenses.filter(exp => exp.id !== parseInt(id));
  res.status(204).send();
});
// Calculate the total expenses for a user
router.get('/total', (req, res) => {
    const totalAmount = expenses.reduce((total, exp) => total + exp.amount, 0);
    res.json({ totalAmount });
  });
  

module.exports = router;
