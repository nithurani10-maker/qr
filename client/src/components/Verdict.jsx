import React, { useState } from 'react';

const Verdict = ({ result, onRescan }) => {
    const [activeTab, setActiveTab] = useState('summary'); // summary, details, raw

    if (!result) return null;

    const isDanger = result.verdict === 'DANGER' || result.verdict === 'SCAM';
    const isWarn = result.verdict === 'SUSPICIOUS' || result.verdict === 'WARN';
    const isSafe = result.verdict === 'SAFE';

    const getHeaderColor = () => {
        if (isDanger) return 'bg-red-500/20 text-red-400 border-red-500/50';
        if (isWarn) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
        return 'bg-green-500/20 text-green-400 border-green-500/50';
    };

    const getIcon = () => {
        if (isDanger) return '⛔';
        if (isWarn) return '⚠️';
        return '✅';
    };

    return (
        <div className="w-full max-w-2xl bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header Verdict */}
            <div className={`p-6 border-b ${getHeaderColor()} flex items-center justify-between`}>
                <div className="flex items-center gap-4">
                    <span className="text-5xl" role="img" aria-label={result.verdict}>{getIcon()}</span>
                    <div>
                        <h2 className="text-3xl font-black tracking-tight">{result.verdict}</h2>
                        <p className="text-sm opacity-90 font-medium uppercase tracking-wider">
                            Risk Score: {result.riskScore}/100
                        </p>
                    </div>
                </div>
                <div className="text-right hidden sm:block">
                    <span className="text-xs uppercase opacity-70 block">Detected Type</span>
                    <span className="font-bold text-lg">{result.detectedType}</span>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-700 bg-slate-900/50">
                <button
                    onClick={() => setActiveTab('summary')}
                    className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'summary' ? 'bg-slate-800 text-blue-400 border-t-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Analysis
                </button>
                <button
                    onClick={() => setActiveTab('details')}
                    className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'details' ? 'bg-slate-800 text-blue-400 border-t-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Technical Data
                </button>
                <button
                    onClick={() => setActiveTab('raw')}
                    className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'raw' ? 'bg-slate-800 text-blue-400 border-t-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Raw Payload
                </button>
            </div>

            {/* Content Area */}
            <div className="p-6 min-h-[200px]">

                {/* SUMMARY TAB */}
                {activeTab === 'summary' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="bg-slate-900/50 p-4 rounded-lg border-l-4 border-slate-600">
                            <h3 className="text-slate-400 text-xs uppercase font-bold mb-2">AI Explanation</h3>
                            <p className="text-slate-200 text-lg leading-relaxed">
                                {result.explanation}
                            </p>
                        </div>

                        {result.riskBreakdown && Object.keys(result.riskBreakdown).length > 0 && (
                            <div>
                                <h3 className="text-slate-400 text-xs uppercase font-bold mb-3">Risk Factors</h3>
                                <div className="space-y-2">
                                    {Object.entries(result.riskBreakdown).map(([layer, data]) => (
                                        data.riskContribution > 0 && (
                                            <div key={layer} className="flex items-start gap-2 text-sm text-red-300 bg-red-900/10 p-2 rounded">
                                                <span>•</span>
                                                <span>{layer}: {data.findings ? data.findings.join(', ') : 'Issue Detected'}</span>
                                            </div>
                                        )
                                    ))}
                                    {result.riskScore === 0 && (
                                        <p className="text-green-400 text-sm italic">No risk factors detected across 7 inspection layers.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="pt-4">
                            {result.detectedType === 'URL' && !isDanger && (
                                <a
                                    href={result.payload}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg transition-transform active:scale-95"
                                >
                                    Open Link Safely
                                </a>
                            )}

                            {isDanger && (
                                <div className="text-center p-3 bg-red-900/20 text-red-200 rounded border border-red-900/50">
                                    <strong className="block text-lg">⚠️ DO NOT PROCEED</strong>
                                    <span className="text-xs">This content is flagged as malicious.</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TECHNICAL DETAILS TAB */}
                {activeTab === 'details' && (
                    <div className="space-y-4 animate-in fade-in">
                        {/* Parsed Fields */}
                        {result.decodedData && Object.keys(result.decodedData).length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.entries(result.decodedData).map(([key, value]) => (
                                    <div key={key} className="bg-slate-900 p-3 rounded border border-slate-700">
                                        <span className="text-xs text-slate-500 uppercase block mb-1">{key}</span>
                                        <span className="text-white font-mono text-sm break-all">{typeof value === 'object' ? JSON.stringify(value) : value}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 italic">No structured data extracted.</p>
                        )}

                        {/* Flags */}
                        {result.flags && result.flags.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-slate-400 text-xs uppercase font-bold mb-2">System Flags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {result.flags.map((flag, idx) => (
                                        <span key={idx} className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-mono">
                                            {flag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-slate-700">
                            <h4 className="text-slate-400 text-xs uppercase font-bold mb-2">Scan Meta</h4>
                            <div className="text-xs text-slate-500 font-mono space-y-1">
                                <p>ID: {result._id || 'N/A'}</p>
                                <p>Timestamp: {new Date(result.timestamp).toISOString()}</p>
                                <p>Engine Ver: v4.0.0</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* RAW PAYLOAD TAB */}
                {activeTab === 'raw' && (
                    <div className="animate-in fade-in">
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 break-all whitespace-pre-wrap max-h-60 overflow-y-auto">
                            {result.payload}
                        </div>
                        <div className="mt-2 text-right">
                            <button
                                onClick={() => navigator.clipboard.writeText(result.payload)}
                                className="text-xs text-blue-400 hover:text-blue-300"
                            >
                                Copy to Clipboard
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-700 bg-slate-900/50 flex justify-center">
                <button
                    onClick={onRescan}
                    className="px-8 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-full font-bold transition-colors text-sm"
                >
                    Scan Another Code
                </button>
            </div>
        </div>
    );
};

export default Verdict;
