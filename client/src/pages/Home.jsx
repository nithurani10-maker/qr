import { useState } from 'react';
import Scanner from '../components/Scanner';
import Verdict from '../components/Verdict';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const Home = () => {
    const [scanResult, setScanResult] = useState(null);
    const [isScanning, setIsScanning] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth(); // Auth token is automatically handled by axios interceptor in Context, but we can access user here if needed.

    const handleScan = async (decodedText) => {
        setIsScanning(false);
        setLoading(true);
        setError(null);

        try {
            // Token is attached automatically by AuthContext if logged in
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/scan/analyze`, {
                payload: decodedText,
                clientInfo: {
                    type: 'web'
                }
            });

            setScanResult(response.data.data);
        } catch (err) {
            console.error("Scan Error", err);
            setError("Failed to analyze code. Please check your connection.");
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
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
            {loading && (
                <div className="flex flex-col items-center animate-pulse py-12" role="status">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                    <p className="text-blue-400 font-bold tracking-wider text-lg">ANALYZING THREATS...</p>
                    <p className="text-slate-500 text-sm mt-2">Checking Global Blacklists & Pattern DB</p>
                </div>
            )}

            {error && (
                <div className="bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-lg mb-6 text-center" role="alert">
                    <p className="font-bold">Analysis Failed</p>
                    <p className="text-sm">{error}</p>
                    <button onClick={() => setError(null)} className="mt-2 text-xs underline">Dismiss</button>
                </div>
            )}

            {!loading && isScanning && (
                <div className="space-y-6">
                    <Scanner onScan={handleScan} />
                    <p className="text-center text-slate-400 text-sm mx-auto bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                        Point your camera at a QR code, UPI Payment code, or Product Barcode.
                    </p>
                </div>
            )}

            {!loading && !isScanning && scanResult && (
                <Verdict result={scanResult} onRescan={handleRescan} />
            )}
        </div>
    );
};

export default Home;
