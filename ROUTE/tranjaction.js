const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');

router.get('/', async (req, res) => {
  const { page = 1, perPage = 10, search = '', month } = req.query;
  const regex = new RegExp(search, 'i');

  const startDate = new Date(`2024-${month}-01`);
  const endDate = new Date(`2024-${parseInt(month) + 1}-01`);

  try {
    const transactions = await Transaction.find({
      dateOfSale: { $gte: startDate, $lt: endDate },
      $or: [
        { title: regex },
        { description: regex },
        { price: regex }
      ]
    }).skip((page - 1) * perPage).limit(Number(perPage));

    const totalCount = await Transaction.countDocuments({
      dateOfSale: { $gte: startDate, $lt: endDate },
      $or: [
        { title: regex },
        { description: regex },
        { price: regex }
      ]
    });

    res.json({
      transactions,
      totalCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
});

module.exports = router;
