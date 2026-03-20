import api from './api';

export const loginUser = async ({ email, password }) => {
  const res = await api.post(
    '/auth/login',
    { email, password },
    { skipAuthRedirect: true }
  );
  return res.data;
};

export const signupUser = async ({ name, email, password }) => {
  const res = await api.post(
    '/auth/signup',
    { name, email, password },
    { skipAuthRedirect: true }
  );
  return res.data;
};

export const updateProfile = async ({ name, email, currentPassword, newPassword }) => {
  const res = await api.put(
    '/auth/profile',
    { name, email, currentPassword, newPassword },
    { skipAuthRedirect: true }
  );
  return res.data;
};
