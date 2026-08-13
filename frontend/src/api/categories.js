import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const authHeader = () => ({
  headers: { Authorization: `Token ${localStorage.getItem('authToken')}` },
});

export const getCategories = () => {
  return axios.get(`${API_BASE_URL}/categories/`, authHeader());
};

export const createCategory = (name) => {
  return axios.post(`${API_BASE_URL}/categories/`, { name }, authHeader());
};

export const deleteCategory = (id) => {
  return axios.delete(`${API_BASE_URL}/categories/${id}/`, authHeader());
};
