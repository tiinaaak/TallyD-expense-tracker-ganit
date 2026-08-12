import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const authHeader = () => ({
  headers: { Authorization: `Token ${localStorage.getItem('authToken')}` },
});

export const getExpenses = () => {
  return axios.get(`${API_BASE_URL}/expenses/`, authHeader());
};

export const createExpense = (expense) => {
  return axios.post(`${API_BASE_URL}/expenses/`, expense, authHeader());
};

export const updateExpense = (id, expense) => {
  return axios.patch(`${API_BASE_URL}/expenses/${id}/`, expense, authHeader());
};

export const deleteExpense = (id) => {
  return axios.delete(`${API_BASE_URL}/expenses/${id}/`, authHeader());
};