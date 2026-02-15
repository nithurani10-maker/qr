import axios from 'axios';

// 1. Centralized Configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://scam-deducer-backend.onrender.com/api/v1',
    timeout: 15000, // Increased timeout for analysis
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

// 3. Response Interceptor (Error Parsing & Auth Handling)
api.interceptors.response.use(
    response => response,
    error => {
        // Network Error
        if (!error.response) {
            console.error("Network Error - Backend Unreachable");
            return Promise.reject({
                message: "Connection Failed. Please check your internet or try again later.",
                isNetwork: true
            });
        }

        // 401 Unauthorized - Key Fix for Auth Flow
        if (error.response.status === 401) {
            console.warn("Session Expired or Unauthorized - Redirecting to Login");
            localStorage.removeItem('token');
            // Force reload to trigger AuthContext re-check if not handled by context
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
            return Promise.reject({
                message: "Session expired. Please login again.",
                status: 401
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
        await api.get('../../health');
        return true;
    } catch (e) {
        return false;
    }
};

export default api;
