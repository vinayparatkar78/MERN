import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const BarChartComponent = ({ month }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchBarChartData = async () => {
      const response = await axios.get('http://localhost:5000/api/stats/bar-chart', {
        params: { month }
      });
      setData(response.data);
    };

    fetchBarChartData();
  }, [month]);

  return (
    <BarChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="range" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#8884d8" />
    </BarChart>
  );
};

export default BarChartComponent;
