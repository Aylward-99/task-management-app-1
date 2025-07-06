import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const loginUser = (email, password) => API.post('/auth/login', { email, password });
export const registerUser = (name, email, password) => API.post('/auth/register', { name, email, password });
export const checkAuth = () => API.get('/auth/check');
export const getTasks = () => API.get('/tasks');
export const createTask = (task) => API.post('/tasks', task);