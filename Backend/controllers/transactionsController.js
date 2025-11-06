const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// Create
exports.createTransaction = async (req, res, next) => {
  try {
    const { type, amount, category, description, date } = req.body;
    const tx = await Transaction.create({ type, amount, category, description, date });
    res.status(201).json(tx);
  } catch (err) {
    next(err);
  }
};

// Read all with optional filters (month/year)
exports.getTransactions = async (req, res, next) => {
  try {
    const { month, year, type } = req.query;
    const filter = {};
    if (type) filter.type = type; // income or expense
    if (month && year) {
      const m = parseInt(month) - 1; // JS months 0-11
      const start = new Date(year, m, 1);
      const end = new Date(year, m + 1, 1);
      filter.date = { $gte: start, $lt: end };
    }
    const txs = await Transaction.find(filter).sort({ date: -1 });
    res.json(txs);
  } catch (err) {
    next(err);
  }
};

// Read single
exports.getTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) 
      return res.status(400).json({ message: 'Invalid id' });
    const tx = await Transaction.findById(id);
    if (!tx) return res.status(404).json({ message: 'Not found' });
    res.json(tx);
  } catch (err) {
    next(err);
  }
};

// Update
exports.updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tx = await Transaction.findByIdAndUpdate(id, req.body,
       { new: true, runValidators: true });
    if (!tx) return res.status(404).json({ message: 'Not found' });
    res.json(tx);
  } catch (err) {
    next(err);
  }
};

// Delete
exports.deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tx = await Transaction.findByIdAndDelete(id);
    if (!tx) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

// Monthly summary: totals per category and total income/expense
exports.getMonthlySummary = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) return res.status(400).json({ message:
       'month and year are required' });

    const m = parseInt(month) - 1;
    const start = new Date(year, m, 1);
    const end = new Date(year, m + 1, 1);

    const pipeline = [
      { $match: { date: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.category',
          totalsByType: {
            $push: {
              type: '$_id.type',
              total: '$total'
            }
          },
          count: { $sum: '$count' }
        }
      },
      {
        $project: {
          category: '$_id',
          totalsByType: 1,
          count: 1,
          _id: 0
        }
      }
    ];

    const categorySummary = await Transaction.aggregate(pipeline);

    // total income and expense
    const totals = await Transaction.aggregate([
      { $match: { date: { $gte: start, $lt: end } } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);

    const result = {
      categories: categorySummary,
      totals
    };

    res.json(result);
  } catch (err) {
    next(err);
  }
};
