import api from '../lib/api/client.js';

export const submitContact = async (payload) => {
  return await api.post('/api/contact', payload, { requireAuth: false });
};

export const getContacts = async (page = 1, limit = 50) => {
  return await api.get(`/api/contact?page=${page}&limit=${limit}`);
};
