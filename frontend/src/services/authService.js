import api from './api';

export const loginUser = async ({ email, password }) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const signupUser = async ({ name, email, password }) => {
  const res = await api.post('/auth/signup', { name, email, password });
  return res.data;
};
