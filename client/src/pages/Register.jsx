import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(username, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="w-full max-w-md bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h2>

            {error && (
                <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4 text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-slate-400 text-sm font-bold mb-2">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        required
                        minLength={3}
                    />
                </div>

                <div>
                    <label className="block text-slate-400 text-sm font-bold mb-2">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        required
                    />
                </div>

                <div>
                    <label className="block text-slate-400 text-sm font-bold mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        required
                        minLength={6}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg"
                >
                    Register
                </button>
            </form>

            <p className="mt-6 text-center text-slate-500 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-400 hover:text-blue-300">
                    Sign in
                </Link>
            </p>
        </div>
    );
};

export default Register;
