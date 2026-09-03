import axios from 'axios';

const API_BASE_URL = 'http://tallyd-backend-alb-2084154047.us-east-1.elb.amazonaws.com/api';

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
