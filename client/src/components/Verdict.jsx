import React, { useState } from 'react';

const Verdict = ({ result, onRescan }) => {
    const [activeTab, setActiveTab] = useState('summary');

    if (!result) return null;

    const isDanger = result.verdict === 'DANGER' || result.verdict === 'SCAM';
    const isWarn = result.verdict === 'SUSPICIOUS' || result.verdict === 'WARN';

    let accentColor = 'var(--success)';
    let badgeClass = 'badge-safe';
    let icon = '✅';

    if (isDanger) {
        accentColor = 'var(--danger)';
        badgeClass = 'badge-danger';
        icon = '⛔';
    } else if (isWarn) {
        accentColor = 'var(--warning)';
        badgeClass = 'badge-warn';
        icon = '⚠️';
    }

    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden', animation: 'fadeIn 0.5s ease-out' }}>

            {/* Header */}
            <div style={{
                padding: '2rem',
                borderBottom: '1px solid var(--border-subtle)',
                background: `linear-gradient(to right, ${isDanger ? '#FEE2E2' : isWarn ? '#FEF3C7' : '#DCFCE7'}, var(--bg-card))`
            }}>
                <div className="flex-between">
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '3.5rem' }}>{icon}</span>
                        <div>
                            <span className={`badge ${badgeClass}`} style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                                {result.verdict}
                            </span>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Analysis Complete</h2>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Risk Score</p>
                        <p style={{ fontSize: '2.5rem', fontWeight: 900, color: accentColor, lineHeight: 1 }}>{result.riskScore}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)' }}>
                {['summary', 'details', 'raw'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            background: activeTab === tab ? 'white' : 'var(--bg-primary)',
                            border: 'none',
                            borderBottom: activeTab === tab ? `2px solid var(--primary)` : 'none',
                            fontWeight: 700,
                            color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
                            textTransform: 'capitalize',
                            cursor: 'pointer'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div style={{ padding: '2rem' }}>
                {activeTab === 'summary' && (
                    <div className="fade-in">
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Summary</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                                {result.explanation}
                            </p>
                        </div>

                        {result.detectedType === 'URL' && !isDanger && (
                            <a
                                href={result.payload}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                style={{ width: '100%', textAlign: 'center' }}
                            >
                                Open Link Safely
                            </a>
                        )}

                        {isDanger && (
                            <div style={{ padding: '1rem', background: 'var(--danger-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--danger-border)', color: 'var(--danger-text)' }}>
                                <strong>⚠️ Warning:</strong> Do not proceed with this content.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'details' && (
                    <div className="fade-in" style={{ display: 'grid', gap: '1rem' }}>
                        {result.decodedData && Object.entries(result.decodedData).map(([key, value]) => (
                            <div key={key} style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
                                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>{key}</p>
                                <p style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                    {typeof value === 'object' ? JSON.stringify(value) : value}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'raw' && (
                    <div className="fade-in">
                        <div style={{ padding: '1rem', background: '#0F172A', color: '#E2E8F0', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', wordBreak: 'break-all', fontSize: '0.9rem' }}>
                            {result.payload}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', background: 'var(--bg-primary)' }}>
                <button onClick={onRescan} className="btn btn-outline" style={{ background: 'white' }}>
                    Scan Another Code
                </button>
            </div>
        </div>
    );
};

export default Verdict;
