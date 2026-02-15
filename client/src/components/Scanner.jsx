import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

const Scanner = ({ onScan }) => {
    const videoRef = useRef(null);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');
    const [videoInputDevices, setVideoInputDevices] = useState([]);
    const [error, setError] = useState(null);
    const codeReader = useRef(new BrowserMultiFormatReader());
    const [scanActive, setScanActive] = useState(true);

    // 1. Initialize Camera List
    useEffect(() => {
        let mounted = true;

        codeReader.current.listVideoInputDevices()
            .then((videoInputDevices) => {
                if (!mounted) return;
                setVideoInputDevices(videoInputDevices);

                // Select back camera by default if available
                if (videoInputDevices.length > 0) {
                    // Try to find back camera
                    const backCamera = videoInputDevices.find(device =>
                        device.label.toLowerCase().includes('back') ||
                        device.label.toLowerCase().includes('environment')
                    );
                    setSelectedDeviceId(backCamera ? backCamera.deviceId : videoInputDevices[0].deviceId);
                }
            })
            .catch((err) => {
                console.error("Camera Error", err);
                setError("Camera permission denied or not available. Please allow camera access.");
            });

        return () => {
            mounted = false;
        };
    }, []);

    // 2. Start Scanning
    useEffect(() => {
        if (!selectedDeviceId || !scanActive) return;

        console.log(`Starting scan on device: ${selectedDeviceId}`);

        codeReader.current.decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.current,
            (result, err) => {
                if (result) {
                    console.log("Code Found:", result.getText());
                    setScanActive(false); // Stop loop immediately
                    onScan(result.getText());
                }
                if (err && !(err instanceof NotFoundException)) {
                    // Real error (not just "no code found" frame)
                    console.warn("Scan warning", err);
                }
            }
        ).catch(err => {
            console.error("Decode Error", err);
            setError("Failed to start camera feed.");
        });

        // Cleanup function to stop camera
        return () => {
            console.log("Stopping Scan Stream");
            codeReader.current.reset();
        };
    }, [selectedDeviceId, scanActive, onScan]);

    return (
        <div className="w-full max-w-md mx-auto">
            {error ? (
                <div className="bg-red-900/50 p-6 rounded-xl border border-red-700 text-center">
                    <p className="text-red-200 font-bold mb-2">Camera Error</p>
                    <p className="text-sm text-red-300">{error}</p>
                </div>
            ) : (
                <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-black aspect-square border-2 border-slate-700">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                    />

                    {/* Overlay Grid */}
                    <div className="absolute inset-0 pointer-events-none opacity-50">
                        <div className="w-full h-full border-2 border-blue-500/30 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-blue-400 rounded-lg shadow-[0_0_100px_rgba(59,130,246,0.5)]">
                                {/* Corners */}
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-500 -mt-1 -ml-1"></div>
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-500 -mt-1 -mr-1"></div>
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-500 -mb-1 -ml-1"></div>
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-500 -mb-1 -mr-1"></div>
                                {/* Scanning Line */}
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-400 animate-scan shadow-[0_0_10px_#60a5fa]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Camera Select */}
                    {videoInputDevices.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                            <select
                                className="bg-black/60 text-white text-xs py-1 px-3 rounded-full backdrop-blur-md border border-white/20 outline-none"
                                value={selectedDeviceId}
                                onChange={(e) => setSelectedDeviceId(e.target.value)}
                            >
                                {videoInputDevices.map((device) => (
                                    <option key={device.deviceId} value={device.deviceId}>
                                        {device.label || `Camera ${device.deviceId.substring(0, 4)}...`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            )}

            <p className="text-center text-slate-500 text-sm mt-4">
                Powered by ZXing Engine v0.20
            </p>
        </div>
    );
};

export default Scanner;
