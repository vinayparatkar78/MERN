import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionsTable = ({ month, onSearch }) => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await axios.get('http://localhost:5000/api/transactions', {
        params: { page, perPage: 10, search, month }
      });
      setTransactions(response.data.transactions);
      setTotalCount(response.data.totalCount);
    };

    fetchTransactions();
  }, [page, search, month]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleNextPage = () => setPage((prevPage) => prevPage + 1);
  const handlePrevPage = () => setPage((prevPage) => prevPage - 1);

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search by title, description or price"
      />
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
            <th>Category</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              <td>{transaction.category}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
        <button onClick={handleNextPage} disabled={page * 10 >= totalCount}>Next</button>
      </div>
    </div>
  );
};

export default TransactionsTable;

