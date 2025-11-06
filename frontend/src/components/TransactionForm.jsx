import React, { useState } from 'react';
import { createTransaction } from '../../api/api';

const defaultCategories = ['Food', 'Rent', 'Transport', 'Salary', 'Shopping', 'Other'];

export default function TransactionForm() {
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().substring(0, 10)
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const payload = { ...form, amount: Number(form.amount), date: new Date(form.date) };
      await createTransaction(payload);
      setMessage('Saved');
      setForm({ ...form, amount: '', description: '' });
      // notify others via a simple custom event
      window.dispatchEvent(new Event('transactionsUpdated'));
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Add Transaction</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Type
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>

        <label>
          Amount
          <input name="amount" value={form.amount} onChange={handleChange} type="number" step="0.01" required />
        </label>

        <label>
          Category
          <select name="category" value={form.category} onChange={handleChange}>
            {defaultCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label>
          Date
          <input name="date" value={form.date} onChange={handleChange} type="date" />
        </label>

        <label>
          Description
          <input name="description" value={form.description} onChange={handleChange} />
        </label>

        <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        <div className="message">{message}</div>
      </form>
    </div>
  );
}
