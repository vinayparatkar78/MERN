import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const PieChartComponent = ({ month }) => {
  const [data, setData] = useState([]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF69B4'];

  useEffect(() => {
    const fetchPieChartData = async () => {
      const response = await axios.get('http://localhost:5000/api/stats/pie-chart', {
        params: { month }
      });
      setData(response.data);
    };

    fetchPieChartData();
  }, [month]);

  return (
    <PieChart width={400} height={400}>
      <Tooltip />
      <Pie data={data} dataKey="count" nameKey="_id" outerRadius={150} fill="#8884d8" label>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default PieChartComponent;

