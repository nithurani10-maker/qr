import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/scan/history`);
                setHistory(res.data.data);
            } catch (err) {
                console.error("Failed to fetch history", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const getVerdictColor = (verdict) => {
        if (verdict === 'SAFE') return 'text-green-400';
        if (verdict === 'DANGER' || verdict === 'SCAM') return 'text-red-400';
        return 'text-yellow-400';
    };

    return (
        <div className="w-full max-w-4xl animate-in fade-in duration-500">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Scan History</h1>
                    <p className="text-slate-400 text-sm">Welcome back, {user?.username}</p>
                </div>
                <Link to="/" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                    New Scan
                </Link>
            </header>

            {loading ? (
                <div className="text-center text-slate-500 py-12">Loading history...</div>
            ) : history.length === 0 ? (
                <div className="text-center bg-slate-800/50 rounded-xl p-12 border border-slate-700">
                    <p className="text-slate-400 mb-4">No scans recorded yet.</p>
                    <Link to="/" className="text-blue-400 hover:underline">Start your first scan</Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {history.map((scan) => (
                        <div key={scan._id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-600 transition-colors">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`font-bold text-sm px-2 py-0.5 rounded bg-slate-900 ${getVerdictColor(scan.verdict)}`}>
                                        {scan.verdict}
                                    </span>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">{scan.detectedType}</span>
                                    <span className="text-xs text-slate-600">• {new Date(scan.timestamp).toLocaleDateString()}</span>
                                </div>
                                <p className="text-slate-200 font-mono text-sm truncate" title={scan.payload}>
                                    {scan.payload}
                                </p>
                                <p className="text-slate-400 text-xs mt-1 truncate">
                                    {scan.explanation}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <div className="text-xs text-slate-500">Risk Score</div>
                                    <div className={`font-bold ${scan.riskScore > 70 ? 'text-red-400' : 'text-slate-300'}`}>
                                        {scan.riskScore}/100
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
