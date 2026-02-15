import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        if (token) {
            checkUser(token);
        } else {
            setLoading(false);
        }
    }, []);

    const checkUser = async (storedToken) => {
        try {
            // 1. Decode locally to check expiry
            const decoded = jwtDecode(storedToken);
            if (decoded.exp * 1000 < Date.now()) {
                console.log("Token expired locally");
                logout();
                return;
            }

            // 2. Set global header
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            setToken(storedToken);

            // 3. Verify with Backend (Critical)
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://scam-deducer-backend.onrender.com/api/v1'}/auth/me`);
                setUser(res.data.data);
            } catch (backendErr) {
                console.error("Backend token verification failed", backendErr);
                logout();
                return;
            }

        } catch (err) {
            console.error("Token decode failed", err);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await axios.post(`${import.meta.env.VITE_API_URL || 'https://scam-deducer-backend.onrender.com/api/v1'}/auth/login`, {
            email,
            password
        });

        const newToken = res.data.token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        // Get user data immediately from response or fetch
        if (res.data.user) {
            setUser(res.data.user);
        } else {
            // Fallback decode if backend doesn't send user object
            const decoded = jwtDecode(newToken);
            setUser({ id: decoded.id });
        }
    };

    const register = async (username, email, password) => {
        const res = await axios.post(`${import.meta.env.VITE_API_URL || 'https://scam-deducer-backend.onrender.com/api/v1'}/auth/register`, {
            username,
            email,
            password
        });

        const newToken = res.data.token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        if (res.data.user) {
            setUser(res.data.user);
        } else {
            const decoded = jwtDecode(newToken);
            setUser({ id: decoded.id });
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
