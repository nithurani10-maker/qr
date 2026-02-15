import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Verdict from '../components/Verdict';
import api from '../services/api';

const AnalyzePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const { rawPayload, type } = location.state || {};

    useEffect(() => {
        if (!rawPayload) {
            navigate('/');
            return;
        }

        const analyzePayload = async () => {
            try {
                const response = await api.post('/scan/analyze', {
                    payload: rawPayload,
                    clientInfo: { type: 'web-mobile', detectedType: type }
                });
                setResult(response.data.data);
            } catch (err) {
                console.error("Analysis Failed", err);
                setError(err.message || "Failed to analyze code.");
            } finally {
                setLoading(false);
            }
        };

        analyzePayload();
    }, [rawPayload, navigate, type]);

    const handleRescan = () => navigate('/');

    if (!rawPayload) return null;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }} className="fade-in">
            <Link to="/" onClick={handleRescan} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                ← Back to Scanner
            </Link>

            {loading && (
                <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
                    <div style={{ width: '3rem', height: '3rem', border: '4px solid var(--border-subtle)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }}></div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Analyzing Payload...</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Checking global threat intelligence feeds.</p>
                </div>
            )}

            {error && (
                <div className="card" style={{ padding: '2rem', textAlign: 'center', borderColor: 'var(--danger)' }}>
                    <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>⚠️</span>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--danger)' }}>Analysis Failed</h2>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>{error}</p>
                    <button onClick={() => window.location.reload()} className="btn btn-primary">Retry Connection</button>

                    <div style={{ marginTop: '2rem', textAlign: 'left', background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Cached Payload</p>
                        <code style={{ wordBreak: 'break-all' }}>{rawPayload}</code>
                    </div>
                </div>
            )}

            {!loading && !error && result && (
                <Verdict result={result} onRescan={handleRescan} />
            )}
        </div>
    );
};
import { Link } from 'react-router-dom';
export default AnalyzePage;
