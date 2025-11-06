import React, { useEffect, useState } from 'react';
import { getTransactions, getSummary } from '../../api/api';
import ChartMonthly from '../components/ChartMonthly';

export default function Summary() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [totals, setTotals] = useState({ income: 0, expense: 0 });
  const [categories, setCategories] = useState([]);

  const fetchTotals = async () => {
    try {
      // totals by querying transactions for the month and summing
      const { data: txs } = await getTransactions({ month, year });
      const inc = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const exp = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      setTotals({ income: inc, expense: exp });

      const { data } = await getSummary({ month, year });
      setCategories(data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTotals();
    const handler = () => fetchTotals();
    window.addEventListener('transactionsUpdated', handler);
    return () => window.removeEventListener('transactionsUpdated', handler);
    // eslint-disable-next-line
  }, [month, year]);

  return (
    <div className="card">
      <h3>Summary</h3>

      <div className="summary-controls">
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i+1} value={i+1}>{i+1}</option>
          ))}
        </select>

        <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} style={{width: '100px'}} />
      </div>

      <div className="totals">
        <div>Income: {totals.income.toFixed(2)}</div>
        <div>Expense: {totals.expense.toFixed(2)}</div>
        <div>Net: {(totals.income - totals.expense).toFixed(2)}</div>
      </div>

      <ChartMonthly categories={categories} totals={totals} />
    </div>
  );
}
