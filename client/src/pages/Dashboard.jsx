import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ total: 0, safe: 0, suspicious: 0, danger: 0 });
    const [recentScan, setRecentScan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/scan/history');
                const history = res.data.data;

                if (history && history.length > 0) {
                    const newStats = history.reduce((acc, scan) => {
                        acc.total++;
                        if (scan.verdict === 'SAFE') acc.safe++;
                        else if (scan.verdict === 'SUSPICIOUS' || scan.verdict === 'WARN') acc.suspicious++;
                        else if (scan.verdict === 'DANGER' || scan.verdict === 'SCAM') acc.danger++;
                        return acc;
                    }, { total: 0, safe: 0, suspicious: 0, danger: 0 });

                    setStats(newStats);
                    setRecentScan(history[0]);
                }
            } catch (err) {
                console.error("Stats Fetch Error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const StatCard = ({ label, value, colorVar, icon }) => (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                <p style={{ fontSize: '2rem', fontWeight: 900, color: `var(--${colorVar})`, lineHeight: 1 }}>{value}</p>
            </div>
            <div style={{ fontSize: '2rem', opacity: 0.8 }}>{icon}</div>
        </div>
    );

    return (
        <div className="fade-in">
            <header className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Security Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Overview for <strong style={{ color: 'var(--text-primary)' }}>{user?.username}</strong></p>
                </div>
                <Link to="/scan" className="btn btn-primary">
                    <span style={{ marginRight: '0.5rem' }}>+</span> Start New Scan
                </Link>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <StatCard label="Total Scans" value={stats.total} colorVar="text-primary" icon="📊" />
                <StatCard label="Safe" value={stats.safe} colorVar="success" icon="✅" />
                <StatCard label="Suspicious" value={stats.suspicious} colorVar="warning" icon="⚠️" />
                <StatCard label="Threats" value={stats.danger} colorVar="danger" icon="⛔" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Recent Activity Card */}
                <div className="card">
                    <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem' }}>Last Scan Activity</h3>
                        <Link to="/history" style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>See All</Link>
                    </div>

                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>
                    ) : recentScan ? (
                        <div>
                            <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                                    <span className={`badge badge-${recentScan.verdict === 'SAFE' ? 'safe' : recentScan.verdict === 'DANGER' ? 'danger' : 'warn'}`}>
                                        {recentScan.verdict}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {new Date(recentScan.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                                <p style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-primary)', wordBreak: 'break-all', marginBottom: '0.5rem' }}>
                                    {recentScan.payload}
                                </p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                                    {recentScan.explanation.substring(0, 80)}...
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>You haven't scanned anything yet.</p>
                            <Link to="/scan" className="btn btn-outline">Scan a Code</Link>
                        </div>
                    )}
                </div>

                {/* Quick Actions Card */}
                <div className="card">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Link to="/profile" className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'none', border: '1px solid var(--border-subtle)' }}>
                            <span style={{ fontSize: '1.5rem', background: 'var(--primary-light)', color: 'var(--primary)', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>👤</span>
                            <div>
                                <p style={{ fontWeight: 700 }}>Account Profile</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Manage your settings</p>
                            </div>
                        </Link>

                        <Link to="/security-info" className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'none', border: '1px solid var(--border-subtle)' }}>
                            <span style={{ fontSize: '1.5rem', background: 'var(--success-bg)', color: 'var(--success)', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>🛡️</span>
                            <div>
                                <p style={{ fontWeight: 700 }}>Security Knowledge</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Learn about threats</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
