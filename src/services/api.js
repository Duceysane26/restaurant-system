import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL; 


const api = axios.create({ 
  baseURL: BASE_URL 
});

// 1. Interceptor-ka codsiyada saaraya Token-ka (Request Interceptor)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Interceptor-ka jawaabaha ee si toos ah u saaraya qofka haddii laga saaro nidaamka (Response Interceptor)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Halkan waxaan u baddalnay removeItem si xogta kale ee nidaamka u nabadgasho
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── AUTH ──────────────────────────────────────────────────────
export const login = (data) => api.post('/auth/login', data);

// ── USERS ─────────────────────────────────────────────────────
export const getUsers     = ()     => api.get('/users');
export const getUserById = (id)   => api.get(`/users/${id}`);
export const createUser  = (data) => api.post('/users', data);
export const updateUser  = (data) => api.put('/users', data);
export const deleteUser  = (id)   => api.delete(`/users/${id}`);

// ── CATEGORIES ────────────────────────────────────────────────
export const getCategories    = ()     => api.get('/categories');
export const createCategory   = (data) => api.post('/categories', data);
export const updateCategory   = (data) => api.put('/categories', data);
export const deleteCategory   = (id)   => api.delete(`/categories/${id}`);

// ── MENU ITEMS ────────────────────────────────────────────────
export const getMenuItems   = ()     => api.get('/menuitems');
export const createMenuItem = (data) => api.post('/menuitems', data);
export const updateMenuItem = (data) => api.put('/menuitems', data);
export const deleteMenuItem = (id)   => api.delete(`/menuitems/${id}`);

// ── TABLES ────────────────────────────────────────────────────
export const getTables    = ()     => api.get('/tables');
export const createTable  = (data) => api.post('/tables', data);
export const updateTable  = (data) => api.put('/tables', data);
export const deleteTable  = (id)   => api.delete(`/tables/${id}`);

// ── ORDERS ────────────────────────────────────────────────────
export const getOrders         = ()             => api.get('/orders');
export const getOrderById      = (id)           => api.get(`/orders/${id}`);
export const createOrder       = (data)         => api.post('/orders', data);
export const updateOrderStatus = (id, status)   => api.put(`/orders/${id}/status?status=${status}`);
export const cancelOrder       = (id)           => api.put(`/orders/${id}/cancel`);

// ── BILLS ─────────────────────────────────────────────────────
export const getBills     = ()     => api.get('/bills');
export const generateBill = (data) => api.post('/bills/generate', data);