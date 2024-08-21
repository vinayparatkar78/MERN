
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const connectDB = require('./database');
const Transaction = require('./models/transaction');
const transactionsRoutes = require('./routes/transactions');
const statsRoutes = require('./routes/stats');

require('dotenv').config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/transactions', transactionsRoutes);
app.use('/api/stats', statsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// API to initialize database
app.get('/api/init', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const data = response.data;

    await Transaction.deleteMany({});  // Clear existing data
    await Transaction.insertMany(data); // Seed new data

    res.status(200).json({ message: 'Database initialized successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error initializing database', error });
  }
});
