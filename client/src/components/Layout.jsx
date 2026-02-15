import { Outlet, Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
            {/* Navbar */}
            <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center gap-2">
                                <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                    ScamDetector<span className="text-slate-600">.AI</span>
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <NavLink to="/" active={location.pathname === '/'}>Scanner</NavLink>
                                {user ? (
                                    <>
                                        <NavLink to="/dashboard" active={location.pathname === '/dashboard'}>History</NavLink>
                                        <button
                                            onClick={logout}
                                            className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors"
                                        >
                                            Login
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="w-full text-center py-6 text-slate-600 text-xs border-t border-slate-800">
                <p>© 2026 ScamDetector.AI - Enterprise Grade Security</p>
                <div className="flex justify-center gap-4 mt-2">
                    <span>Privacy</span>
                    <span>Terms</span>
                    <span>Contact</span>
                </div>
            </footer>
        </div>
    );
};

const NavLink = ({ to, children, active }) => (
    <Link
        to={to}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${active
                ? 'bg-slate-800 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
    >
        {children}
    </Link>
);

export default Layout;
