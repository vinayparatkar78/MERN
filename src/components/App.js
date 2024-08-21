import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

const App = () => {
  const [month, setMonth] = useState('03'); // Default to March

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  return (
    <div>
      <h1>Sales Analyzer</h1>
      <select value={month} onChange={handleMonthChange}>
        {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m) => (
          <option key={m} value={m}>
            {new Date(`2024-${m}-01`).toLocaleString('default', { month: 'long' })}
          </option>
        ))}
      </select>
      <TransactionsTable month={month} />
      <Statistics month={month} />
      <BarChart month={month} />
      <PieChart month={month} />
    </div>
  );
};

export default App;
