import axios from 'axios';

const API_BASE_URL = 'http://tallyd-backend-alb-2084154047.us-east-1.elb.amazonaws.com/api/accounts';

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
