import React, { useState } from 'react';
import { humanizeVerdict } from '../utils/verdictHumanizer';

const Verdict = ({ result, onRescan }) => {
    const [showBreakdown, setShowBreakdown] = useState(false);
    const [unlocked, setUnlocked] = useState(false);

    if (!result) return null;

    const { summary, description, action, actionColor, icon, signals } = humanizeVerdict(result);
    const isDanger = result.verdict === 'DANGER' || result.verdict === 'SCAM';
    const isWarn = result.verdict === 'WARN' || result.verdict === 'SUSPICIOUS';

    return (
        <div
            className="w-full max-w-md bg-slate-800 rounded-xl p-6 shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500"
            role="alert"
            aria-live="assertive"
        >
            {/* Header / Summary */}
            <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl" aria-hidden="true">{icon}</div>
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{summary}</h2>
                    <div className={`inline-block px-2 py-0.5 rounded text-xs font-bold mt-1 ${isDanger ? 'bg-red-500/20 text-red-400' :
                            isWarn ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                        Risk Score: {result.riskScore}/100
                    </div>
                </div>
            </div>

            {/* Human Readable Description */}
            <p className="text-slate-300 mb-6 text-sm leading-relaxed border-l-2 border-slate-600 pl-3">
                {description}
            </p>

            {/* Key Findings / Signals */}
            {signals.length > 0 && (
                <div className="mb-6 bg-slate-900/50 p-3 rounded-lg">
                    <h3 className="text-slate-400 text-xs uppercase font-bold mb-2 tracking-wider">Why we say this:</h3>
                    <ul className="space-y-1">
                        {signals.map((signal, idx) => (
                            <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                                <span className="text-slate-500 mt-0.5">•</span> {signal}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Primary Action / Advice */}
            <div className={`p-4 rounded-lg mb-6 ${isDanger ? 'bg-red-900/20 border border-red-900/50' : 'bg-slate-700/30'}`}>
                <strong className={`block text-sm uppercase mb-1 ${isDanger ? 'text-red-400' : 'text-slate-400'}`}>Recommended Action:</strong>
                <span className="text-white font-medium text-lg">{action}</span>
            </div>

            {/* Guardrails for Dangerous Content */}
            {result.detectedType === 'URL' && (
                <div className="mb-6">
                    {isDanger && !unlocked ? (
                        <div className="space-y-3">
                            <button
                                onClick={onRescan}
                                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-colors shadow-lg"
                                aria-label="Go back to safety"
                            >
                                Back to Safety
                            </button>
                            <button
                                onClick={() => setUnlocked(true)}
                                className="w-full text-xs text-slate-500 hover:text-slate-400 underline decoration-slate-600 underline-offset-4"
                            >
                                I understand the risks, let me proceed
                            </button>
                        </div>
                    ) : (
                        <a
                            href={result.fingerprint ? '#' : result.payload} // In real app use actual payload
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block w-full text-center py-3 rounded-lg font-bold text-white shadow-lg transition-transform active:scale-95 ${actionColor} ${isDanger ? 'opacity-75 hover:opacity-100' : ''}`}
                            aria-label={`Open link: ${result.payload}`}
                            onClick={(e) => {
                                if (isDanger && !window.confirm("Are you ABSOLUTELY sure? This site is flagged as dangerous.")) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            Open Link {isDanger && '(Unsafe)'}
                        </a>
                    )}
                </div>
            )}

            {/* Rescan / Toggle Details */}
            <div className="flex gap-3 mt-4">
                <button
                    onClick={onRescan}
                    className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold transition-colors text-sm"
                >
                    Scan Another
                </button>
                <button
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors text-sm font-medium"
                    aria-label={showBreakdown ? "Hide details" : "Show technical details"}
                >
                    {showBreakdown ? 'Hide Debug' : 'Debug Info'}
                </button>
            </div>

            {/* Technical Breakdown (Hidden by default) */}
            {showBreakdown && (
                <div className="mt-6 pt-6 border-t border-slate-700/50 text-xs text-slate-400 font-mono animate-in fade-in slide-in-from-top-2">
                    <p className="mb-2 text-slate-500 uppercase tracking-widest text-[10px]">Technical Intelligence</p>
                    <div className="max-h-40 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                        {Object.entries(result.riskBreakdown || {}).map(([layer, data]) => (
                            <div key={layer} className="mb-2">
                                <span className="text-blue-400 font-bold capitalize">{layer}:</span>{' '}
                                <span className="text-slate-300">
                                    {data.findings && data.findings.length > 0 ? data.findings.join(', ') : 'No flags'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Verdict;
