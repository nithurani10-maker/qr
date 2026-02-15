import axios from 'axios';

// 1. Centralized Configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://scam-deducer-backend.onrender.com/api/v1', // Fallback to prod if env missing
    timeout: 10000, // 10s strict timeout
    headers: {
        'Content-Type': 'application/json'
    }
});

// 2. Request Interceptor (Auth Token)
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

// 3. Response Interceptor (Error Parsing)
api.interceptors.response.use(
    response => response,
    error => {
        // Network Error (Scanner specific)
        if (!error.response) {
            console.error("Network Error - Backend Unreachable");
            return Promise.reject({
                message: "Connection Failed. Please check your internet or try again later.",
                isNetwork: true
            });
        }

        // 4xx Client Errors
        if (error.response.status >= 400 && error.response.status < 500) {
            return Promise.reject({
                message: error.response.data?.error || "Invalid Request",
                status: error.response.status
            });
        }

        // 5xx Server Errors
        if (error.response.status >= 500) {
            return Promise.reject({
                message: "Server is experiencing issues. Please try again.",
                status: error.response.status
            });
        }

        return Promise.reject(error);
    }
);

export const checkHealth = async () => {
    try {
        await api.get('../../health'); // Relative check to root health
        return true;
    } catch (e) {
        return false;
    }
};

export default api;
