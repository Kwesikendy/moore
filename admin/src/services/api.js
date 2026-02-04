import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('adminToken');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('adminToken');
};

export const getMembers = async () => {
    const response = await api.get('/members');
    return response.data;
};

export const createMember = async (data) => {
    const response = await api.post('/members', data);
    return response.data;
};

export const updateMember = async (id, data) => {
    const response = await api.put(`/members/${id}`, data);
    return response.data;
};

export const deleteMember = async (id) => {
    const response = await api.delete(`/members/${id}`);
    return response.data;
};

export const getFormSchema = async () => {
    const response = await api.get('/schema');
    return response.data;
};

export const updateFormSchema = async (elements) => {
    const response = await api.post('/schema', { elements });
    return response.data;
};

export default api;
