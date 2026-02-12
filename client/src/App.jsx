import { useState } from 'react';
import Scanner from './components/Scanner';
import Verdict from './components/Verdict';
import axios from 'axios';

function App() {
    const [scanResult, setScanResult] = useState(null);
    const [isScanning, setIsScanning] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleScan = async (decodedText) => {
        setIsScanning(false);
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/scan/analyze`, {
                payload: decodedText
            });

            setScanResult(response.data.data);
        } catch (err) {
            console.error("Scan Error", err);
            setError("Failed to analyze code. Please check your connection.");
            // Allow retry
            setIsScanning(true);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleRescan = () => {
        setScanResult(null);
        setIsScanning(true);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 font-sans">
            <header className="w-full max-w-md flex flex-col items-center mb-8 mt-4">
                <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    ScamDetector<span className="text-slate-600">.AI</span>
                </h1>
                <p className="text-slate-500 text-xs uppercase tracking-widest mt-1">Real-time Fraud Protection</p>
            </header>

            <main className="w-full flex-1 flex flex-col items-center justify-center -mt-10">

                {loading && (
                    <div className="flex flex-col items-center animate-pulse" role="status">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-blue-400 font-bold tracking-wider">ANALYZING THREATS...</p>
                        <p className="text-slate-500 text-xs mt-2">Checking Global Blacklists & Pattern DB</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-lg mb-6 text-center max-w-sm" role="alert">
                        <p className="font-bold">Error</p>
                        <p className="text-sm">{error}</p>
                        <button onClick={() => setError(null)} className="mt-2 text-xs underline">Dismiss</button>
                    </div>
                )}

                {!loading && isScanning && (
                    <div className="w-full max-w-md space-y-4 animate-in fade-in zoom-in duration-300">
                        <Scanner onScan={handleScan} />
                        <p className="text-center text-slate-400 text-sm max-w-xs mx-auto">
                            Point your camera at a QR code, UPI Payment code, or Product Barcode to verify it instantly.
                        </p>
                    </div>
                )}

                {!loading && !isScanning && scanResult && (
                    <Verdict result={scanResult} onRescan={handleRescan} />
                )}

            </main>

            <footer className="w-full max-w-md text-center py-6 text-slate-600 text-xs border-t border-slate-800 mt-8">
                <p>Protected by ScamDetector v4.0</p>
                <div className="flex justify-center gap-4 mt-2">
                    <span>• Global Reputation Engine</span>
                    <span>• GS1 Product Verification</span>
                    <span>• AI Threat Analysis</span>
                </div>
            </footer>
        </div>
    );
}

export default App;
