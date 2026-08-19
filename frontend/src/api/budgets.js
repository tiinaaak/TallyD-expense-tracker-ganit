import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const authHeader = () => ({
  headers: { Authorization: `Token ${localStorage.getItem('authToken')}` },
});

export const getBudgets = () => {
  return axios.get(`${API_BASE_URL}/budgets/`, authHeader());
};

export const createBudget = (budget) => {
  return axios.post(`${API_BASE_URL}/budgets/`, budget, authHeader());
};

export const deleteBudget = (id) => {
  return axios.delete(`${API_BASE_URL}/budgets/${id}/`, authHeader());
};