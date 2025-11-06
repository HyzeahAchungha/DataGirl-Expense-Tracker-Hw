import React, { useEffect, useState } from 'react';
import { getTransactions, deleteTransaction } from '../../api/api';

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState({});

  const fetch = async () => {
    try {
      const { data } = await getTransactions(filter);
      setTransactions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetch();
    const handler = () => fetch();
    window.addEventListener('transactionsUpdated', handler);
    return () => window.removeEventListener('transactionsUpdated', handler);
    // eslint-disable-next-line
  }, [filter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    await deleteTransaction(id);
    fetch();
  };

  return (
    <div className="card">
      <h3>Transactions</h3>
      <div className="filters">
        <select onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}>
          <option value="">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <ul className="tx-list">
        {transactions.length === 0 && <li>No transactions</li>}
        {transactions.map(tx => (
          <li key={tx._id} className={tx.type}>
            <div>
              <strong>{tx.category}</strong> — {tx.description || '-'} <br />
              <small>{new Date(tx.date).toLocaleDateString()}</small>
            </div>
            <div>
              <span>{tx.type === 'income' ? '+' : '-'}{tx.amount.toFixed(2)}</span>
              <button onClick={() => handleDelete(tx._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
