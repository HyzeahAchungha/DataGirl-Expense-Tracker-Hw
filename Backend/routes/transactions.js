const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionsController');

router.post('/', controller.createTransaction);
router.get('/', controller.getTransactions);
router.get('/summary', controller.getMonthlySummary);
router.get('/:id', controller.getTransaction);
router.put('/:id', controller.updateTransaction);
router.delete('/:id', controller.deleteTransaction);

module.exports = router;
