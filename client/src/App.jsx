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

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
                <div style={{ width: '3rem', height: '3rem', border: '4px solid var(--border-subtle)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Public Route Wrapper (Redirects to Dashboard if logged in)
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null; // Or spinner

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        {/* Default Redirect */}
                        <Route index element={<PublicRoute><Login /></PublicRoute>} />

                        {/* Auth Routes (Public but redirect if logged in) */}
                        <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />

                        {/* Static Info (Public) */}
                        <Route path="security-info" element={<SecurityInfo />} />

                        {/* Functionality Routes (Protected) */}
                        <Route path="scan" element={<ProtectedRoute><ScanPage /></ProtectedRoute>} />
                        <Route path="analyze" element={<ProtectedRoute><AnalyzePage /></ProtectedRoute>} />
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
