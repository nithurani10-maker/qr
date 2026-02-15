import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ScanPage from './pages/ScanPage';
import AnalyzePage from './pages/AnalyzePage';
import Dashboard from './pages/Dashboard';
import HistoryPage from './pages/HistoryPage';
import Profile from './pages/Profile';
import SecurityInfo from './pages/SecurityInfo';
import Login from './pages/Login';
import Register from './pages/Register';
import useAuth from './hooks/useAuth';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="text-center text-white py-20">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        {/* Public Routes */}
                        <Route index element={<Navigate to="/scan" replace />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />

                        {/* Functionality Routes */}
                        <Route path="scan" element={<ScanPage />} />
                        <Route path="analyze" element={<AnalyzePage />} />
                        <Route path="security-info" element={<SecurityInfo />} />

                        {/* Protected Routes */}
                        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
                        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
