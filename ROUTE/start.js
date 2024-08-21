const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');

router.get('/statistics', async (req, res) => {
  const { month } = req.query;
  const startDate = new Date(`2024-${month}-01`);
  const endDate = new Date(`2024-${parseInt(month) + 1}-01`);

  try {
    const totalSales = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate }, sold: true } },
      { $group: { _id: null, totalAmount: { $sum: '$price' }, totalSoldItems: { $sum: 1 } } }
    ]);

    const totalNotSoldItems = await Transaction.countDocuments({
      dateOfSale: { $gte: startDate, $lt: endDate },
      sold: false
    });

    res.json({
      totalSalesAmount: totalSales[0]?.totalAmount || 0,
      totalSoldItems: totalSales[0]?.totalSoldItems || 0,
      totalNotSoldItems
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error });
  }
});

router.get('/bar-chart', async (req, res) => {
  const { month } = req.query;
  const startDate = new Date(`2024-${month}-01`);
  const endDate = new Date(`2024-${parseInt(month) + 1}-01`);

  try {
    const priceRanges = [
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate }, price: { $gte: 0, $lte: 100 } } },
      { $group: { _id: '0-100', count: { $sum: 1 } } },
      // Repeat similar stages for other price ranges
    ];

    const barChartData = await Transaction.aggregate(priceRanges);
    res.json(barChartData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bar chart data', error });
  }
});

router.get('/pie-chart', async (req, res) => {
  const { month } = req.query;
  const startDate = new Date(`2024-${month}-01`);
  const endDate = new Date(`2024-${parseInt(month) + 1}-01`);

  try {
    const categories = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pie chart data', error });
  }
});

router.get('/combined', async (req, res) => {
  const { month } = req.query;
  try {
    const [statistics, barChart, pieChart] = await Promise.all([
      axios.get(`http://localhost:5000/api/stats/statistics?month=${month}`),
      axios.get(`http://localhost:5000/api/stats/bar-chart?month=${month}`),
      axios.get(`http://localhost:5000/api/stats/pie-chart?month=${month}`)
    ]);

    res.json({
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching combined data', error });
  }
});

module.exports = router;
