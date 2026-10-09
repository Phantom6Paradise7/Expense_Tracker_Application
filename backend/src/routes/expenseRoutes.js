const express = require('express');
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

// Every expense route needs a logged-in user (Admin or User)
router.use(authenticateUser);

router.get('/', getExpenses);
router.get('/:id', getExpenseById);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
