import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Donor API
export const donorAPI = {
  register: (data: any) => api.post('/donors', data),
  getAll: () => api.get('/donors'),
  getById: (id: string) => api.get(`/donors/${id}`),
};

// Donation API
export const donationAPI = {
  submit: (data: any) => api.post('/donations/submit', data),
  getAll: () => api.get('/donations'),
  getByDonor: (donorId: string) => api.get(`/donations/donor/${donorId}`),
  getPending: () => api.get('/donations/pending'),
};

// Stock API
export const stockAPI = {
  getAll: () => api.get('/stock'),
  getByCity: (city: string) => api.get(`/stock/city/${city}`),
  getStatus: () => api.get('/stock/status'),
  getExpiringSoon: () => api.get('/stock/expiring-soon'),
};

// Hospital API
export const hospitalAPI = {
  getAll: () => api.get('/hospitals'),
  getById: (id: number) => api.get(`/hospitals/${id}`),
};

// Request API
export const requestAPI = {
  create: (data: any) => api.post('/requests/create', data),
  getAll: () => api.get('/requests'),
  process: () => api.post('/requests/process'),
  getSummary: () => api.get('/requests/summary'),
};

// City API
export const cityAPI = {
  getAll: () => api.get('/cities'),
  getDistances: () => api.get('/cities/distances'),
};

export default api;