import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/accounts';

export const registerUser = (username, email, password) => {
  return axios.post(`${API_BASE_URL}/register/`, {
    username,
    email,
    password,
  });
};

export const loginUser = (email, password) => {
  return axios.post(`${API_BASE_URL}/login/`, {
    email,
    password,
  });
};

export const requestPasswordReset = (email) => {
  return axios.post(`${API_BASE_URL}/password-reset/`, { email });
};

export const confirmPasswordReset = (uid, token, newPassword) => {
  return axios.post(`${API_BASE_URL}/password-reset-confirm/`, {
    uid,
    token,
    new_password: newPassword,
  });
};