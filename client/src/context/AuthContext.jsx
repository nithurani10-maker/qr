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
            // Decode purely to check expiry first
            const decoded = jwtDecode(storedToken);
            if (decoded.exp * 1000 < Date.now()) {
                logout();
                return;
            }

            // Set global header
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

            // Allow app to render with token while we fetch full user details
            setToken(storedToken);

            // Optionally fetch fresh user data
            // const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`);
            // setUser(res.data.data);

            // For speed, just use decoded for now or simple object
            setUser({ id: decoded.id });
        } catch (err) {
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
            email,
            password
        });

        const newToken = res.data.token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        const decoded = jwtDecode(newToken);
        setUser({ id: decoded.id, ...res.data.user });

        return res.data;
    };

    const register = async (username, email, password) => {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
            username,
            email,
            password
        });

        const newToken = res.data.token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        const decoded = jwtDecode(newToken);
        setUser({ id: decoded.id, ...res.data.user });

        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
