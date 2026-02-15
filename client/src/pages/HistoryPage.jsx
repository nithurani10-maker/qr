import { useState, useEffect } from 'react';
import api from '../services/api';

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/scan/history');
                setHistory(res.data.data);
            } catch (err) {
                console.error("History Error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const filteredHistory = filter === 'ALL'
        ? history
        : history.filter(h => {
            if (filter === 'SAFE') return h.verdict === 'SAFE';
            if (filter === 'WARN') return h.verdict === 'SUSPICIOUS' || h.verdict === 'WARN';
            if (filter === 'DANGER') return h.verdict === 'DANGER' || h.verdict === 'SCAM';
            return true;
        });

    return (
        <div className="fade-in">
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Scan History</h1>

                <div style={{ background: 'var(--bg-card)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex' }}>
                    {['ALL', 'SAFE', 'WARN', 'DANGER'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                background: filter === f ? 'var(--primary-light)' : 'transparent',
                                color: filter === f ? 'var(--primary)' : 'var(--text-secondary)',
                                border: 'none'
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Loading records...</div>
            ) : filteredHistory.length === 0 ? (
                <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>No history found for this category.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {filteredHistory.map(scan => (
                        <div key={scan._id} className="card" style={{ padding: '1.5rem' }}>
                            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                <span className={`badge badge-${scan.verdict === 'SAFE' ? 'safe' : scan.verdict === 'DANGER' ? 'danger' : 'warn'}`}>
                                    {scan.verdict}
                                </span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    {new Date(scan.timestamp).toLocaleDateString()}
                                </span>
                            </div>

                            <p style={{ fontFamily: 'monospace', fontSize: '0.9rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {scan.payload}
                            </p>

                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', height: '2.5em', overflow: 'hidden' }}>
                                {scan.explanation}
                            </p>

                            <div className="flex-between" style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{scan.detectedType}</span>
                                <span style={{ fontSize: '0.9rem', fontWeight: 900, color: scan.riskScore > 50 ? 'var(--danger)' : 'var(--text-primary)' }}>
                                    Risk: {scan.riskScore}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
