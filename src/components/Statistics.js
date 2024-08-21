import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = ({ month }) => {
  const [stats, setStats] = useState({ totalSalesAmount: 0, totalSoldItems: 0, totalNotSoldItems: 0 });

  useEffect(() => {
    const fetchStatistics = async () => {
      const response = await axios.get('http://localhost:5000/api/stats/statistics', {
        params: { month }
      });
      setStats(response.data);
    };

    fetchStatistics();
  }, [month]);

  return (
    <div>
      <h2>Statistics</h2>
      <p>Total Sales Amount: ${stats.totalSalesAmount}</p>
      <p>Total Sold Items: {stats.totalSoldItems}</p>
      <p>Total Not Sold Items: {stats.totalNotSoldItems}</p>
    </div>
  );
};

export default Statistics;
