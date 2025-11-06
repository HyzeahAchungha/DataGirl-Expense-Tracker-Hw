import axios from 'axios';


const API = axios.create({
  baseURL: 'https://datagirl-expense-tracker-hw-1.onrender.com', // your backend URL
});

export const getTransactions = (params) => API.get('/transactions', { params });
export const createTransaction = (data) => API.post('/transactions', data);
export const updateTransaction = (id, data) => API.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);
export const getSummary = (params) => API.get('/transactions/summary', { params });
