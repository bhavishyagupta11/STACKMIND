import api from './api';

export const submitReview = async ({ code, language, interviewMode }) => {
  const res = await api.post('/review', { code, language, interviewMode });
  return res.data;
};

export const getHistory = async (page = 1, limit = 10) => {
  const res = await api.get(`/history?page=${page}&limit=${limit}`);
  return res.data;
};

export const getReviewById = async (id) => {
  const res = await api.get(`/history/${id}`);
  return res.data;
};

export const deleteReview = async (id) => {
  const res = await api.delete(`/history/${id}`);
  return res.data;
};
