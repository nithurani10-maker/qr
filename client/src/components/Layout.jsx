import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/scan', label: 'Scan Code', icon: '📷' },
        { path: '/history', label: 'Scan History', icon: '📜' },
        { path: '/security-info', label: 'Security Info', icon: '🛡️' },
        { path: '/profile', label: 'Profile', icon: '👤' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Navbar */}
            <nav style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid var(--border-subtle)',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <div className="container-max">
                    <div style={{ height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Logo */}
                        <Link to="/" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 900 }} className="text-gradient">
                                ScamDetector
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {user ? (
                                <>
                                    {menuItems.map((item) => (
                                        <NavLink key={item.path} to={item.path} active={location.pathname === item.path}>
                                            {item.label}
                                        </NavLink>
                                    ))}
                                    <button onClick={logout} className="btn btn-ghost" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                                    Login
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={toggleMenu}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.5rem',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                display: 'none'
                            }}
                            className="mobile-only-toggle"
                        >
                            {isMenuOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>
            </nav>

            <style>{`
                @media (max-width: 768px) {
                    .hidden-mobile { display: none !important; }
                    .mobile-only-toggle { display: block !important; }
                }
            `}</style>

            {/* Mobile Drawer */}
            {isMenuOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 40,
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <div
                        onClick={closeMenu}
                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(2px)' }}
                    ></div>

                    <div style={{
                        width: '80%',
                        maxWidth: '300px',
                        background: 'var(--bg-card)',
                        height: '100%',
                        position: 'relative',
                        padding: '2rem',
                        boxShadow: 'var(--shadow-lg)',
                        borderLeft: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }} className="fade-in">
                        {user ? (
                            <>
                                <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Signed in as</p>
                                    <p style={{ fontWeight: 'bold' }}>{user.email}</p>
                                </div>
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={closeMenu}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem',
                                            borderRadius: 'var(--radius-md)',
                                            background: location.pathname === item.path ? 'var(--bg-primary)' : 'transparent',
                                            color: location.pathname === item.path ? 'var(--primary)' : 'var(--text-primary)',
                                            fontWeight: location.pathname === item.path ? '700' : '500'
                                        }}
                                    >
                                        <span>{item.icon}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                                <button
                                    onClick={logout}
                                    className="btn btn-outline"
                                    style={{ marginTop: 'auto', width: '100%' }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" onClick={closeMenu} className="btn btn-primary">
                                Login / Register
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* Content */}
            <main style={{ flex: 1, padding: '2rem 0' }}>
                <div className="container-max">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer style={{ background: 'white', borderTop: '1px solid var(--border-subtle)', padding: '2rem 0', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    © 2026 ScamDetector.AI Security Systems
                </p>
            </footer>
        </div>
    );
};

const NavLink = ({ to, children, active }) => (
    <Link
        to={to}
        style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem',
            fontWeight: 500,
            color: active ? 'var(--primary)' : 'var(--text-secondary)',
            background: active ? 'var(--primary-light)' : 'transparent',
            transition: 'all 0.2s'
        }}
    >
        {children}
    </Link>
);

export default Layout;
